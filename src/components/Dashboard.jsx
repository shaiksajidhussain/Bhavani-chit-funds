import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminDashboard from './dashboard/AdminDashboard';
import AgentDashboard from './dashboard/AgentDashboard';
import CustomerManagement from './dashboard/CustomerManagement';
import ChitSchemeManagement from './dashboard/ChitSchemeManagement';
import CollectionManagement from './dashboard/CollectionManagement';
import AuctionManagement from './dashboard/AuctionManagement';
import Reports from './dashboard/Reports';
import PassbookSystem from './dashboard/PassbookSystem';
import DashboardSidebar from './dashboard/DashboardSidebar';
import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';
import useCustomerStore from '../stores/customerStore';
import usePassbookStore from '../stores/passbookStore';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Passbook search functionality
  const { customers, fetchCustomers, loading: customersLoading, fetchCustomerSchemes } = useCustomerStore();
  const { 
    entries: passbookEntries, 
    formData: passbookFormData,
    setFormData: setPassbookFormData,
    fetchPassbookEntries,
    deletePassbookEntry,
    clearAll: clearAllPassbookData
  } = usePassbookStore();
  
  // Get active tab from URL or default to overview
  const getActiveTabFromUrl = useCallback(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      return 'overview';
    }
    const tab = path.split('/dashboard/')[1];
    return tab || 'overview';
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passbookSearchQuery, setPassbookSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showPassbookSearch, setShowPassbookSearch] = useState(false);
  const [showPassbookModal, setShowPassbookModal] = useState(false);
  const [customerSchemes, setCustomerSchemes] = useState([]);
  const [selectedPassbookScheme, setSelectedPassbookScheme] = useState(null);
  const [passbookFrequencyFilter, setPassbookFrequencyFilter] = useState('all');
  const [passbookDateFrom, setPassbookDateFrom] = useState('');
  const [passbookDateTo, setPassbookDateTo] = useState('');
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromUrl());
  }, [location.pathname, getActiveTabFromUrl]);
  
  // Close sidebar on mobile when tab changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(passbookSearchQuery.toLowerCase()) ||
    customer.mobile.includes(passbookSearchQuery)
  );

  // Handle passbook search
  const handlePassbookSearch = async (customer) => {
    try {
      setSelectedCustomer(customer);
      const schemes = await fetchCustomerSchemes(customer.id);
      setCustomerSchemes(schemes);
      setShowPassbookModal(true);
    } catch (error) {
      console.error('Error fetching customer schemes:', error);
    }
  };

  // Handle passbook scheme change
  const handlePassbookSchemeChange = (schemeId) => {
    const scheme = customerSchemes.find(s => s.scheme.id === schemeId);
    if (scheme) {
      setSelectedPassbookScheme(scheme);
      setPassbookFormData({
        ...passbookFormData,
        schemeId: schemeId,
        chittiAmount: scheme.scheme.chitValue.toString()
      });
      fetchPassbookEntries(selectedCustomer.id, schemeId);
    }
  };


  // Handle passbook entry edit
  const handleEditPassbookEntry = (entry) => {
    setPassbookFormData({
      month: entry.month?.toString() || '',
      date: entry.date.split('T')[0],
      dailyPayment: entry.dailyPayment.toString(),
      amount: entry.amount.toString(),
      chittiAmount: entry.chittiAmount.toString(),
      chitLiftingAmount: entry.chitLiftingAmount?.toString() || '',
      type: entry.type,
      paymentMethod: entry.paymentMethod,
      paymentFrequency: entry.paymentFrequency,
      chitLifting: entry.chitLifting,
      remarks: entry.remarks || ''
    });
  };

  // Handle passbook entry deletion
  const handleDeletePassbookEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deletePassbookEntry(entryId);
        if (selectedPassbookScheme) {
          await fetchPassbookEntries(selectedCustomer.id, selectedPassbookScheme.scheme.id);
        }
      } catch (error) {
        console.error('Error deleting passbook entry:', error);
      }
    }
  };

  // Close passbook modal
  const handleClosePassbookModal = () => {
    setShowPassbookModal(false);
    setSelectedCustomer(null);
    setCustomerSchemes([]);
    setSelectedPassbookScheme(null);
    setPassbookFrequencyFilter('all');
    setPassbookDateFrom('');
    setPassbookDateTo('');
    clearAllPassbookData();
  };
  
  // Handle tab change with URL update
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tab}`);
    }
  };
  
  // Determine user type based on role
  const getUserType = () => {
    if (!user) return 'admin';
    switch (user.role) {
      case 'ADMIN': return 'admin';
      case 'AGENT': return 'agent';
      case 'COLLECTOR': return 'collector';
      default: return 'admin';
    }
  };

  const renderContent = () => {
    const userType = getUserType();
    
    // Show different content based on user role
    if (userType === 'agent') {
      switch (activeTab) {
        case 'overview':
          return <AgentDashboard onNavigate={handleTabChange} />;
        case 'collections':
          return <CollectionManagement />;
        case 'customers':
          return <CustomerManagement />;
        case 'passbook':
          return <PassbookSystem />;
        default:
          return <AgentDashboard />;
      }
    }
    
    // Admin and Collector see all features
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard onNavigate={handleTabChange} />;
      case 'customers':
        return <CustomerManagement />;
      case 'schemes':
        return (
          <ErrorBoundary>
            <ChitSchemeManagement />
          </ErrorBoundary>
        );
      case 'collections':
        return <CollectionManagement />;
      case 'auctions':
        return <AuctionManagement />;
      case 'reports':
        return <Reports />;
      case 'passbook':
        return <PassbookSystem />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="flex">
          <DashboardSidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange}
            userType={getUserType()}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          <div className="flex-1 lg:ml-64 transition-all duration-300">
            {/* Mobile Header with Hamburger */}
            <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                {activeTab === 'overview' ? 'Dashboard' : 
                 activeTab === 'customers' ? 'Customer Management' :
                 activeTab === 'schemes' ? 'Chit Schemes' :
                 activeTab === 'collections' ? 'Collections' :
                 activeTab === 'auctions' ? 'Auctions' :
                 activeTab === 'reports' ? 'Reports' :
                 activeTab === 'passbook' ? 'Passbook' :
                 'Dashboard'}
              </h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
            
            <div className="p-4 lg:p-6">
              {/* Passbook Search - Always visible at the top */}
             

              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Passbook Modal */}
      {showPassbookModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Passbook - {selectedCustomer.name}
                </h2>
                <p className="text-sm text-gray-600">{selectedCustomer.mobile}</p>
              </div>
              <button
                onClick={handleClosePassbookModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {customerSchemes.length > 0 ? (
                <div className="space-y-6">
                  {/* Scheme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Scheme
                    </label>
                    <select
                      value={selectedPassbookScheme?.scheme.id || ''}
                      onChange={(e) => handlePassbookSchemeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a scheme</option>
                      {customerSchemes.map((customerScheme) => (
                        <option key={customerScheme.scheme.id} value={customerScheme.scheme.id}>
                          {customerScheme.scheme.name} - ₹{customerScheme.scheme.chitValue.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Passbook Entries */}
                  {selectedPassbookScheme && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Passbook Entries - {selectedPassbookScheme.scheme.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                          Chit Value: ₹{selectedPassbookScheme.scheme.chitValue.toLocaleString()}
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                          value={passbookFrequencyFilter}
                          onChange={(e) => setPassbookFrequencyFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Frequencies</option>
                          <option value="DAILY">Daily</option>
                          <option value="WEEKLY">Weekly</option>
                          <option value="MONTHLY">Monthly</option>
                        </select>
                        <input
                          type="date"
                          value={passbookDateFrom}
                          onChange={(e) => setPassbookDateFrom(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="From Date"
                        />
                        <input
                          type="date"
                          value={passbookDateTo}
                          onChange={(e) => setPassbookDateTo(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="To Date"
                        />
                      </div>

                      {/* Passbook Entries Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chit Lifting</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {passbookEntries
                              .filter(entry => {
                                if (passbookFrequencyFilter !== 'all' && entry.paymentFrequency !== passbookFrequencyFilter) return false;
                                if (passbookDateFrom && new Date(entry.date) < new Date(passbookDateFrom)) return false;
                                if (passbookDateTo && new Date(entry.date) > new Date(passbookDateTo)) return false;
                                return true;
                              })
                              .map((entry) => (
                                <tr key={entry.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(entry.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      entry.type === 'MANUAL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {entry.type}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹{entry.amount.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {entry.paymentMethod}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      entry.chitLifting === 'YES' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {entry.chitLifting}
                                    </span>
                                    {entry.chitLifting === 'YES' && entry.chitLiftingAmount && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        Amount: ₹{entry.chitLiftingAmount.toLocaleString()}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => handleEditPassbookEntry(entry)}
                                      className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeletePassbookEntry(entry.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Add Manual Entry Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setPassbookFormData(prev => ({
                              ...prev,
                              schemeId: selectedPassbookScheme.scheme.id,
                              chittiAmount: selectedPassbookScheme.scheme.chitValue.toString()
                            }));
                            setShowPassbookModal(false);
                            // You can add a form modal here or navigate to a form page
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Manual Entry
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No schemes found for this customer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

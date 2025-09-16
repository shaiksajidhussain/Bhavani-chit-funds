import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCustomerStore from '../../stores/customerStore';
import usePassbookStore from '../../stores/passbookStore';

const AdminDashboard = () => {
  // Customer store
  const {
    customers,
    loading: customersLoading,
    error: customersError,
    selectedCustomer,
    showPassbookModal,
    setShowPassbookModal,
    setSelectedCustomer,
    fetchCustomers
  } = useCustomerStore();

  // Passbook store
  const {
    entries: passbookEntries,
    loading: passbookLoading,
    error: passbookError,
    showAddForm: showPassbookForm,
    formData: passbookFormData,
    setShowAddForm: setShowPassbookForm,
    setFormData: setPassbookFormData,
    resetForm: resetPassbookForm,
    fetchPassbookEntries,
    createPassbookEntry,
    updatePassbookEntry,
    deletePassbookEntry,
    clearError: clearPassbookError
  } = usePassbookStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchRef, setSearchRef] = useState(null);
  const [editingPassbookEntry, setEditingPassbookEntry] = useState(null);
  const [isPassbookSubmitting, setIsPassbookSubmitting] = useState(false);
  const [isPassbookDeleting, setIsPassbookDeleting] = useState(false);

  // Fetch customers on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCustomers();
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    };
    loadData();
  }, [fetchCustomers]);

  // Click outside handler to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef && !searchRef.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  // Search functionality
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length >= 2) {
      const results = customers.filter(customer => 
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.mobile.includes(term)
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle member click - open passbook
  const handleMemberClick = async (customer) => {
    setSelectedCustomer(customer);
    setShowPassbookModal(true);
    setShowSearchResults(false);
    setSearchTerm('');
    
    // Fetch passbook entries for this customer
    try {
      await fetchPassbookEntries(customer.id);
    } catch (error) {
      handleApiError(error, 'Failed to load passbook entries');
    }
  };

  // Helper function to handle API errors and show toast notifications
  const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    
    if (error.response?.data) {
      const { success, message, errors } = error.response.data;
      
      if (!success && errors && Array.isArray(errors)) {
        // Handle validation errors - show each error message
        errors.forEach(errorItem => {
          const fieldName = errorItem.path || 'Field';
          const errorMessage = errorItem.msg || 'Invalid value';
          toast.error(`${fieldName}: ${errorMessage}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
      } else if (message) {
        // Handle general error messages
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(defaultMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else if (error.message) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(defaultMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Helper function to show success messages
  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Passbook form handlers
  const handlePassbookInputChange = (e) => {
    const { name, value } = e.target;
    setPassbookFormData({
      ...passbookFormData,
      [name]: value
    });
  };

  const handlePassbookSubmit = async (e) => {
    e.preventDefault();
    if (selectedCustomer) {
      setIsPassbookSubmitting(true);
      try {
        if (editingPassbookEntry) {
          await updatePassbookEntry(selectedCustomer.id, passbookFormData);
          showSuccessMessage('Passbook entry updated successfully!');
        } else {
          await createPassbookEntry(selectedCustomer.id, passbookFormData);
          showSuccessMessage('Passbook entry created successfully!');
        }
        // Refresh passbook entries after creation/update
        await fetchPassbookEntries(selectedCustomer.id);
        resetPassbookForm();
        setEditingPassbookEntry(null);
        setShowPassbookForm(false);
      } catch (error) {
        handleApiError(error, 'Failed to save passbook entry');
      } finally {
        setIsPassbookSubmitting(false);
      }
    }
  };

  const handleDeletePassbookEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this passbook entry?')) {
      setIsPassbookDeleting(true);
      try {
        await deletePassbookEntry(entryId);
        showSuccessMessage('Passbook entry deleted successfully!');
        // Refresh passbook entries after deletion
        if (selectedCustomer) {
          await fetchPassbookEntries(selectedCustomer.id);
        }
      } catch (error) {
        handleApiError(error, 'Failed to delete passbook entry');
      } finally {
        setIsPassbookDeleting(false);
      }
    }
  };

  const handleEditPassbookEntry = (entry) => {
    setEditingPassbookEntry(entry);
    setPassbookFormData({
      month: entry.month.toString(),
      date: new Date(entry.date).toISOString().split('T')[0],
      dailyPayment: entry.dailyPayment.toString(),
      amount: entry.amount.toString(),
      chittiAmount: entry.chittiAmount.toString(),
      type: entry.type,
      paymentMethod: entry.paymentMethod || 'CASH',
      paymentFrequency: entry.paymentFrequency || 'DAILY',
      chitLifting: entry.chitLifting || 'NO'
    });
    setShowPassbookForm(true);
  };

  // Calculate overview data from real data
  const safeCustomers = Array.isArray(customers) ? customers : [];
  
  // Calculate daily and monthly profits (simplified calculation)
  const dailyProfits = safeCustomers.reduce((sum, customer) => {
    if (customer.status === 'ACTIVE' && customer.amountPerDay) {
      return sum + (customer.amountPerDay * 0.1); // Assuming 10% profit margin
    }
    return sum;
  }, 0);
  
  const monthlyProfits = dailyProfits * 30; // Daily profits * 30 days
  
  const overviewData = {
    totalCustomers: safeCustomers.length,
    activeChits: safeCustomers.filter(c => c.status === 'ACTIVE').length,
    totalCollectionToday: 0, // This would need to be calculated from collections
    dailyProfits: dailyProfits,
    monthlyProfits: monthlyProfits,
    chitAuctionUpdates: 0 // This would need to be calculated from auctions
  };

  const quickActions = [
    { id: 1, title: 'Add New Customer', icon: '👤', color: 'bg-blue-500' },
    { id: 2, title: 'Create New Chit Scheme', icon: '📋', color: 'bg-green-500' },
    { id: 3, title: 'Record Collection', icon: '💰', color: 'bg-yellow-500' },
    { id: 4, title: 'Generate Reports', icon: '📊', color: 'bg-purple-500' }
  ];

  const recentActivities = [
    { id: 1, type: 'collection', customer: 'Rajesh Kumar', amount: 2500, time: '2 hours ago' },
    { id: 2, type: 'auction', customer: 'Priya Sharma', amount: 500000, time: '4 hours ago' },
    { id: 3, type: 'registration', customer: 'Amit Singh', amount: 0, time: '6 hours ago' },
    { id: 4, type: 'collection', customer: 'Sunita Patel', amount: 500, time: '8 hours ago' }
  ];


  return (
    <div className="space-y-6 h-full overflow-y-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Loading and Error States */}
      {customersLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Loading dashboard data...</span>
          </div>
        </div>
      )}

      {customersError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">Error: {customersError}</span>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{overviewData.totalCustomers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Chits</p>
              <p className="text-2xl font-bold text-gray-900">{overviewData.activeChits}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900">₹{overviewData.totalCollectionToday.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Profits</p>
              <p className="text-2xl font-bold text-gray-900">₹{overviewData.dailyProfits.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Profits</p>
              <p className="text-2xl font-bold text-gray-900">₹{overviewData.monthlyProfits.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Auction Updates</p>
              <p className="text-2xl font-bold text-gray-900">{overviewData.chitAuctionUpdates}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        {/* Search Members */}
        <div className="mb-6" ref={setSearchRef}>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Search Members</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or mobile number..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {customersLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => handleMemberClick(customer)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {customer.photo ? (
                          <img
                            src={customer.photo}
                            alt={`${customer.name} photo`}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-medium">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.mobile}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">ID: M{customer.id.toString().padStart(4, '0')}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          customer.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {customer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No members found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium">{action.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">
                  {activity.type === 'collection' ? '💰' : 
                   activity.type === 'auction' ? '🔨' : '👤'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{activity.customer}</p>
                  <p className="text-sm text-gray-600 capitalize">{activity.type}</p>
                </div>
              </div>
              <div className="text-right">
                {activity.amount > 0 && (
                  <p className="font-medium text-gray-900">₹{activity.amount.toLocaleString()}</p>
                )}
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passbook Modal */}
      {showPassbookModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Passbook - {selectedCustomer.name}
                </h2>
                <button
                  onClick={() => setShowPassbookModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Customer Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Customer ID:</span>
                    <p className="font-medium">M{selectedCustomer.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedCustomer.mobile}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCustomer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      selectedCustomer.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Group:</span>
                    <p className="font-medium">{selectedCustomer.group}</p>
                  </div>
                </div>
              </div>

              {/* Passbook Loading and Error States */}
              {passbookLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-800">Loading passbook entries...</span>
                  </div>
                </div>
              )}

              {passbookError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-800">Error: {passbookError}</span>
                    </div>
                    <button
                      onClick={clearPassbookError}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Add Passbook Entry Button */}
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
                <button
                  onClick={() => setShowPassbookForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add Manual Entry
                </button>
              </div>

              {/* Add Passbook Entry Form Modal */}
              {showPassbookForm && (
                <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-60">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingPassbookEntry ? 'Edit Passbook Entry' : 'Add Passbook Entry'}
                    </h3>
                    <form onSubmit={handlePassbookSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                          <input
                            type="number"
                            name="month"
                            value={passbookFormData.month}
                            onChange={handlePassbookInputChange}
                            required
                            min="1"
                            max="12"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={passbookFormData.date}
                            onChange={handlePassbookInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {passbookFormData.paymentFrequency === 'MONTHLY' ? 'Monthly Payment (₹)' : 'Daily Payment (₹)'}
                          </label>
                          <input
                            type="number"
                            name="dailyPayment"
                            value={passbookFormData.dailyPayment}
                            onChange={handlePassbookInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                          <input
                            type="number"
                            name="amount"
                            value={passbookFormData.amount}
                            onChange={handlePassbookInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chitti Amount (₹)</label>
                          <input
                            type="number"
                            name="chittiAmount"
                            value={passbookFormData.chittiAmount}
                            onChange={handlePassbookInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                          <select
                            name="paymentMethod"
                            value={passbookFormData.paymentMethod}
                            onChange={handlePassbookInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="CHEQUE">Cheque</option>
                            <option value="NOT_PAID">Not Paid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Frequency</label>
                          <select
                            name="paymentFrequency"
                            value={passbookFormData.paymentFrequency}
                            onChange={handlePassbookInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="DAILY">Daily</option>
                            <option value="MONTHLY">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chit Lifting</label>
                          <select
                            name="chitLifting"
                            value={passbookFormData.chitLifting}
                            onChange={handlePassbookInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="NO">No</option>
                            <option value="YES">Yes</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPassbookForm(false);
                            setEditingPassbookEntry(null);
                            resetPassbookForm();
                          }}
                          disabled={isPassbookSubmitting}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isPassbookSubmitting || passbookLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isPassbookSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {editingPassbookEntry ? 'Updating...' : 'Adding...'}
                            </>
                          ) : (
                            editingPassbookEntry ? 'Update Entry' : 'Add Entry'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Passbook Entries Table */}
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chitti Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chit Lifting</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {passbookEntries && passbookEntries.length > 0 ? (
                          passbookEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {entry.month}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(entry.date).toLocaleDateString('en-GB')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">₹{entry.dailyPayment.toLocaleString()}</div>
                                  <div className="text-xs text-gray-500">
                                    {entry.paymentFrequency === 'MONTHLY' ? 'Monthly' : 'Daily'} Payment
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{entry.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{entry.chittiAmount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.paymentMethod === 'CASH' 
                                    ? 'bg-green-100 text-green-800' :
                                  entry.paymentMethod === 'BANK_TRANSFER' 
                                    ? 'bg-blue-100 text-blue-800' :
                                  entry.paymentMethod === 'UPI' 
                                    ? 'bg-purple-100 text-purple-800' :
                                  entry.paymentMethod === 'CHEQUE' 
                                    ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                  {entry.paymentMethod?.replace('_', ' ') || 'CASH'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.paymentFrequency === 'DAILY' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {entry.paymentFrequency || 'DAILY'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.chitLifting === 'YES' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {entry.chitLifting || 'NO'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.type === 'GENERATED' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {entry.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {entry.type === 'MANUAL' ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditPassbookEntry(entry)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeletePassbookEntry(entry.id)}
                                      disabled={isPassbookDeleting}
                                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                      {isPassbookDeleting ? (
                                        <>
                                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                          Deleting...
                                        </>
                                      ) : (
                                        'Delete'
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                              {passbookLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                  Loading entries...
                                </div>
                              ) : (
                                <div className="text-center">
                                  <p className="text-gray-500 mb-2">No passbook entries found.</p>
                                  <p className="text-sm text-gray-400">This member has no passbook entries yet.</p>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Print Options */}
              <div className="mt-6 flex justify-end space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Print Passbook
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Export to PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AdminDashboard;

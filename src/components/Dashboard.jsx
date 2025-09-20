import React, { useState, useEffect } from 'react';
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

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get active tab from URL or default to overview
  const getActiveTabFromUrl = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      return 'overview';
    }
    const tab = path.split('/dashboard/')[1];
    return tab || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromUrl());
  }, [location.pathname]);
  
  // Close sidebar on mobile when tab changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);
  
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
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

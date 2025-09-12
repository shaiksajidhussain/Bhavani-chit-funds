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
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromUrl());
  }, [location.pathname]);
  
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
          return <AgentDashboard />;
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
        return <AdminDashboard />;
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
        <DashboardSidebar className="z-[99999]" 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          userType={getUserType()}
        />
          <div className="flex-1 ml-64">
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

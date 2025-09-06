import React, { useState } from 'react';
import AdminDashboard from './dashboard/AdminDashboard';
import CustomerManagement from './dashboard/CustomerManagement';
import ChitSchemeManagement from './dashboard/ChitSchemeManagement';
import CollectionManagement from './dashboard/CollectionManagement';
import AuctionManagement from './dashboard/AuctionManagement';
// import Reports from './dashboard/Reports';
// import PassbookSystem from './dashboard/PassbookSystem';
// import AgentDashboard from './dashboard/AgentDashboard';
import DashboardSidebar from './dashboard/DashboardSidebar';
import Reports from './dashboard/Reports';
import PassbookSystem from './dashboard/PassbookSystem';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userType, setUserType] = useState('admin'); // admin, agent, customer

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'schemes':
        return <ChitSchemeManagement />;
      case 'collections':
        return <CollectionManagement />;
      case 'auctions':
        return <AuctionManagement />;
      case 'reports':
        return <Reports />;
      case 'passbook':
        return <PassbookSystem />;
      case 'agent':
        return <AgentDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          userType={userType}
        />
        <div className="flex-1 ml-64">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

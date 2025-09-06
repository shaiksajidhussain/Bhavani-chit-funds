import React from 'react';

const DashboardSidebar = ({ activeTab, setActiveTab, userType }) => {
  const adminMenuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'customers', label: 'Customer Management', icon: '👥' },
    { id: 'schemes', label: 'Chit Schemes', icon: '📋' },
    // { id: 'collections', label: 'Collections', icon: '💰' },
    { id: 'auctions', label: 'Auctions/Lifting', icon: '🔨' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    // { id: 'passbook', label: 'Passbook', icon: '📖' },
  ];

  const agentMenuItems = [
    { id: 'agent', label: 'Agent Dashboard', icon: '🏠' },
    { id: 'collections', label: 'Collections', icon: '💰' },
    { id: 'customers', label: 'My Customers', icon: '👥' },
  ];

  const customerMenuItems = [
    { id: 'overview', label: 'My Account', icon: '👤' },
    { id: 'passbook', label: 'My Passbook', icon: '📖' },
    { id: 'collections', label: 'Payment History', icon: '💰' },
  ];

  const getMenuItems = () => {
    switch (userType) {
      case 'agent':
        return agentMenuItems;
      case 'customer':
        return customerMenuItems;
      default:
        return adminMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Bhavani Chits</h1>
        </div>
        
        <div className="mb-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">User Type</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setUserType('admin')}
              className={`px-3 py-1 text-xs rounded-full ${
                userType === 'admin' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setUserType('agent')}
              className={`px-3 py-1 text-xs rounded-full ${
                userType === 'agent' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Agent
            </button>
            <button
              onClick={() => setUserType('customer')}
              className={`px-3 py-1 text-xs rounded-full ${
                userType === 'customer' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Customer
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;

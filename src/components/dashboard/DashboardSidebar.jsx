import React from 'react';

const DashboardSidebar = ({ activeTab, setActiveTab, userType, isOpen, setIsOpen }) => {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/45 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `} style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Bhavani Chits</h1>
        </div>
        
        <div className="mb-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">User Role</div>
          <div className="px-3 py-2 bg-gray-100 rounded-lg">
            <span className={`text-sm font-medium ${
              userType === 'admin' ? 'text-blue-700' :
              userType === 'agent' ? 'text-green-700' :
              'text-purple-700'
            }`}>
              {userType === 'admin' ? 'Administrator' :
               userType === 'agent' ? 'Agent' :
               'Customer'}
            </span>
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
    </>
  );
};

export default DashboardSidebar;

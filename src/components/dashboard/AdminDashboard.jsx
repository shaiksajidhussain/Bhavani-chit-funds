import React from 'react';

const AdminDashboard = () => {
  // Static data for demonstration
  const overviewData = {
    totalCustomers: 1250,
    activeChits: 45,
    totalCollectionToday: 125000,
    totalPendingAmount: 450000,
    upcomingDues: 12,
    chitAuctionUpdates: 3
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

  const upcomingDues = [
    { id: 1, customer: 'Vikram Reddy', amount: 2500, dueDate: 'Today' },
    { id: 2, customer: 'Anita Gupta', amount: 500, dueDate: 'Tomorrow' },
    { id: 3, customer: 'Suresh Kumar', amount: 3000, dueDate: 'Dec 15' },
    { id: 4, customer: 'Meera Joshi', amount: 1500, dueDate: 'Dec 16' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

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
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{overviewData.totalPendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Dues</p>
              <p className="text-2xl font-bold text-gray-900">{overviewData.upcomingDues}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
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

      {/* Recent Activities and Upcoming Dues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Upcoming Dues */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Dues (Next 7 Days)</h2>
          <div className="space-y-3">
            {upcomingDues.map((due) => (
              <div key={due.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📅</span>
                  <div>
                    <p className="font-medium text-gray-900">{due.customer}</p>
                    <p className="text-sm text-gray-600">Due: {due.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-600">₹{due.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

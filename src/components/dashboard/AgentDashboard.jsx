import React, { useState } from 'react';

const AgentDashboard = ({ onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Static agent data
  const agentStats = {
    totalCustomers: 45,
    todayCollections: 12500,
    pendingCollections: 8500,
    monthlyTarget: 500000,
    monthlyAchieved: 375000
  };

  const todayCollections = [
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      customerId: 'C001',
      amount: 500,
      paymentMethod: 'Cash',
      time: '10:30 AM',
      status: 'Completed'
    },
    {
      id: 2,    
      customerName: 'Priya Sharma',
      customerId: 'C002',
      amount: 2500,
      paymentMethod: 'Bank Transfer',
      time: '11:15 AM',
      status: 'Completed'
    },
    {
      id: 3,
      customerName: 'Amit Singh',
      customerId: 'C003',
      amount: 0,
      paymentMethod: 'Not Paid',
      time: '12:00 PM',
      status: 'Pending'
    }
  ];

  const pendingCustomers = [
    {
      id: 1,
      name: 'Sunita Patel',
      phone: '9876543213',
      amount: 500,
      daysOverdue: 2,
      lastPayment: '2024-12-12'
    },
    {
      id: 2,
      name: 'Vikram Reddy',
      phone: '9876543214',
      amount: 2500,
      daysOverdue: 1,
      lastPayment: '2024-12-13'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (achieved, target) => {
    return Math.round((achieved / target) * 100);
  };

  const quickActions = [
    { id: 1, title: 'Record Collection', icon: '💰', color: 'bg-blue-600', tab: 'collections' },
    { id: 2, title: 'Send Reminder', icon: '📱', color: 'bg-green-600', tab: 'customers' },
    { id: 3, title: 'View Reports', icon: '📊', color: 'bg-purple-600', tab: 'reports' }
  ];

  // Handle quick action button clicks
  const handleQuickAction = (action) => {
    if (onNavigate) {
      onNavigate(action.tab);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Customers</p>
              <p className="text-2xl font-bold text-gray-900">{agentStats.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900">₹{agentStats.todayCollections.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Collection</p>
              <p className="text-2xl font-bold text-gray-900">₹{agentStats.pendingCollections.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Target</p>
              <p className="text-2xl font-bold text-gray-900">₹{agentStats.monthlyTarget.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Progress</p>
              <p className="text-2xl font-bold text-gray-900">{getProgressPercentage(agentStats.monthlyAchieved, agentStats.monthlyTarget)}%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full" 
            style={{ width: `${getProgressPercentage(agentStats.monthlyAchieved, agentStats.monthlyTarget)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>₹{agentStats.monthlyAchieved.toLocaleString()}</span>
          <span>₹{agentStats.monthlyTarget.toLocaleString()}</span>
        </div>
      </div>

      {/* Today's Collections and Pending Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Collections */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Collections</h2>
          <div className="space-y-3">
            {todayCollections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">💰</span>
                  <div>
                    <p className="font-medium text-gray-900">{collection.customerName}</p>
                    <p className="text-sm text-gray-600">ID: {collection.customerId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{collection.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{collection.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(collection.status)}`}>
                    {collection.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Customers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Collections</h2>
          <div className="space-y-3">
            {pendingCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">₹{customer.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{customer.daysOverdue} days overdue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium">{action.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

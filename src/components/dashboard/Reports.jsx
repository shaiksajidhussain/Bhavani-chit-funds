import React, { useState } from 'react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('daily');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Static report data
  const reportData = {
    daily: {
      totalCollection: 125000,
      paidMembers: 45,
      pendingMembers: 8,
      defaulters: 2,
      collectionRate: 85.5
    },
    monthly: {
      totalCollection: 3750000,
      paidMembers: 1200,
      pendingMembers: 50,
      defaulters: 15,
      collectionRate: 88.2
    },
    yearly: {
      totalCollection: 45000000,
      paidMembers: 1250,
      pendingMembers: 200,
      defaulters: 50,
      collectionRate: 86.5
    }
  };

  const currentData = reportData[selectedReport];

  const reportTypes = [
    { id: 'daily', label: 'Daily Report', icon: '📅' },
    { id: 'monthly', label: 'Monthly Report', icon: '📊' },
    { id: 'yearly', label: 'Yearly Report', icon: '📈' },
    { id: 'customer', label: 'Customer Report', icon: '👥' },
    { id: 'scheme', label: 'Scheme Report', icon: '📋' }
  ];

  const topCustomers = [
    { name: 'Rajesh Kumar', totalPaid: 150000, balance: 350000, status: 'Active' },
    { name: 'Priya Sharma', totalPaid: 200000, balance: 300000, status: 'Active' },
    { name: 'Amit Singh', totalPaid: 500000, balance: 0, status: 'Completed' },
    { name: 'Sunita Patel', totalPaid: 120000, balance: 180000, status: 'Defaulted' }
  ];

  const schemePerformance = [
    { scheme: '₹5,00,000 - 30 months', members: 30, enrolled: 25, collection: 85, status: 'Active' },
    { scheme: '₹5,00,000 - 200 days', members: 20, enrolled: 18, collection: 90, status: 'Active' },
    { scheme: '₹3,00,000 - 18 months', members: 25, enrolled: 25, collection: 100, status: 'Completed' }
  ];

  const handleExport = (format) => {
    alert(`Exporting ${selectedReport} report as ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Report Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedReport === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">{type.icon}</span>
                <span className="font-medium">{type.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collection</p>
              <p className="text-2xl font-bold text-gray-900">₹{currentData.totalCollection.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Members</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.paidMembers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Members</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.pendingMembers}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Defaulters</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.defaulters}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-900">{currentData.collectionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers and Scheme Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Customers</h2>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">Balance: ₹{customer.balance.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{customer.totalPaid.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                    customer.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheme Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scheme Performance</h2>
          <div className="space-y-3">
            {schemePerformance.map((scheme, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{scheme.scheme}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    scheme.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {scheme.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Members: {scheme.enrolled}/{scheme.members}</span>
                  <span>Collection: {scheme.collection}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${scheme.collection}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="flex space-x-4">
          <button 
            onClick={() => handleExport('Excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Export to Excel
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Export to PDF
          </button>
          <button 
            onClick={() => handleExport('CSV')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export to CSV
          </button>
          <button 
            onClick={() => handleExport('Print')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;

import React, { useEffect } from 'react';
import useReportsStore from '../../stores/reportsStore';

const Reports = () => {
  const {
    reportData,
    topCustomers,
    schemePerformance,
    loading,
    error,
    selectedReport,
    dateRange,
    setSelectedReport,
    setDateRange,
    fetchReport,
    clearError
  } = useReportsStore();

  // Fetch data on component mount and when report type changes
  useEffect(() => {
    fetchReport();
  }, [selectedReport, dateRange.startDate, fetchReport]);

  const reportTypes = [
    { id: 'daily', label: 'Daily Report', icon: '📅' },
    { id: 'monthly', label: 'Monthly Report', icon: '📊' },
    { id: 'yearly', label: 'Yearly Report', icon: '📈' },
    { id: 'customer', label: 'Customer Report', icon: '👥' },
    { id: 'scheme', label: 'Scheme Report', icon: '📋' }
  ];

  // Use API data from store
  const currentData = reportData || {
    totalCollection: 0,
    paidMembers: 0,
    pendingMembers: 0,
    defaulters: 0,
    collectionRate: 0
  };

  const handleExport = (format) => {
    alert(`Exporting ${selectedReport} report as ${format}...`);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 lg:space-y-6 h-full overflow-y-auto px-2 sm:px-4 py-4 lg:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Loading report data...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">Error: {error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Report Type Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Select Report Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                selectedReport === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">{type.icon}</span>
                <span className="font-medium text-xs sm:text-sm lg:text-base">{type.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Collection</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">₹{currentData.totalCollection.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Paid Members</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentData.paidMembers}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Pending Members</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentData.pendingMembers}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Defaulters</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentData.defaulters}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Collection Rate</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentData.collectionRate}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers and Scheme Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Customers */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Top Customers</h2>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium text-blue-700 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Balance: ₹{customer.balance.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">₹{customer.totalPaid.toLocaleString()}</p>
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
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Scheme Performance</h2>
          <div className="space-y-3">
            {schemePerformance.map((scheme, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <h3 className="font-medium text-gray-900 truncate">{scheme.scheme}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    scheme.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {scheme.status}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 mb-2 gap-1 sm:gap-0">
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

      {/* Customer Report Specific Content */}
      {selectedReport === 'customer' && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Customer Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">150</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">142</p>
              <p className="text-sm text-gray-600">Active Customers</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">8</p>
              <p className="text-sm text-gray-600">Defaulted Customers</p>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Report Specific Content */}
      {selectedReport === 'scheme' && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Scheme Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">3</p>
              <p className="text-sm text-gray-600">Total Schemes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">2</p>
              <p className="text-sm text-gray-600">Active Schemes</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-sm text-gray-600">Completed Schemes</p>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => handleExport('Excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            Export to Excel
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Export to PDF
          </button>
          <button 
            onClick={() => handleExport('CSV')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Export to CSV
          </button>
          <button 
            onClick={() => handleExport('Print')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;

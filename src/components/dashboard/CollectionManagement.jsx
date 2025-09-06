import React, { useState } from 'react';

const CollectionManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  // Static collection data
  const [collections, setCollections] = useState([
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      customerId: 'C001',
      amountPaid: 500,
      collectorName: 'Amit Singh',
      date: '2024-12-14',
      balanceRemaining: 44500,
      paymentMethod: 'Cash',
      remarks: 'On time payment'
    },
    {
      id: 2,
      customerName: 'Priya Sharma',
      customerId: 'C002',
      amountPaid: 2500,
      collectorName: 'Sunita Patel',
      date: '2024-12-14',
      balanceRemaining: 122500,
      paymentMethod: 'Bank Transfer',
      remarks: 'Early payment'
    },
    {
      id: 3,
      customerName: 'Amit Singh',
      customerId: 'C003',
      amountPaid: 500,
      collectorName: 'Vikram Reddy',
      date: '2024-12-14',
      balanceRemaining: 44500,
      paymentMethod: 'Cash',
      remarks: 'Regular payment'
    },
    {
      id: 4,
      customerName: 'Sunita Patel',
      customerId: 'C004',
      amountPaid: 0,
      collectorName: 'Amit Singh',
      date: '2024-12-14',
      balanceRemaining: 180000,
      paymentMethod: 'Not Paid',
      remarks: 'Defaulted - 3 days overdue'
    }
  ]);

  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    amountPaid: '',
    collectorName: '',
    date: selectedDate,
    balanceRemaining: '',
    paymentMethod: 'Cash',
    remarks: ''
  });

  const collectors = ['Amit Singh', 'Sunita Patel', 'Vikram Reddy', 'Anita Gupta'];
  const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Not Paid'];

  const filteredCollections = collections.filter(collection => 
    collection.date === selectedDate
  );

  const dailySummary = {
    totalCollected: filteredCollections.reduce((sum, collection) => sum + collection.amountPaid, 0),
    paidMembers: filteredCollections.filter(collection => collection.amountPaid > 0).length,
    pendingMembers: filteredCollections.filter(collection => collection.amountPaid === 0).length,
    totalMembers: filteredCollections.length
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCollection) {
      setCollections(prev => prev.map(collection => 
        collection.id === editingCollection.id ? { ...formData, id: editingCollection.id } : collection
      ));
      setEditingCollection(null);
    } else {
      const newCollection = {
        ...formData,
        id: collections.length + 1,
        amountPaid: parseInt(formData.amountPaid) || 0
      };
      setCollections(prev => [...prev, newCollection]);
    }
    setShowAddCollection(false);
    setFormData({
      customerName: '',
      customerId: '',
      amountPaid: '',
      collectorName: '',
      date: selectedDate,
      balanceRemaining: '',
      paymentMethod: 'Cash',
      remarks: ''
    });
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData(collection);
    setShowAddCollection(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this collection record?')) {
      setCollections(prev => prev.filter(collection => collection.id !== id));
    }
  };

  const getPaymentStatusColor = (amount) => {
    if (amount === 0) return 'bg-red-100 text-red-800';
    if (amount > 0) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (amount) => {
    if (amount === 0) return 'Not Paid';
    if (amount > 0) return 'Paid';
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Collection Management</h1>
        <div className="flex space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setShowAddCollection(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Collection
          </button>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold text-gray-900">₹{dailySummary.totalCollected.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{dailySummary.paidMembers}</p>
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
              <p className="text-2xl font-bold text-gray-900">{dailySummary.pendingMembers}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{dailySummary.totalMembers}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Collection Form Modal */}
      {showAddCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCollection ? 'Edit Collection' : 'Add New Collection'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                  <input
                    type="text"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balance Remaining (₹)</label>
                  <input
                    type="number"
                    name="balanceRemaining"
                    value={formData.balanceRemaining}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collector Name</label>
                  <select
                    name="collectorName"
                    value={formData.collectorName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Collector</option>
                    {collectors.map((collector, index) => (
                      <option key={index} value={collector}>{collector}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {paymentMethods.map((method, index) => (
                      <option key={index} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter any remarks about the collection..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCollection(false);
                    setEditingCollection(null);
                    setFormData({
                      customerName: '',
                      customerId: '',
                      amountPaid: '',
                      collectorName: '',
                      date: selectedDate,
                      balanceRemaining: '',
                      paymentMethod: 'Cash',
                      remarks: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCollection ? 'Update Collection' : 'Add Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Collection Sheet */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Daily Collection Sheet - {new Date(selectedDate).toLocaleDateString()}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collector</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCollections.map((collection) => (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{collection.customerName}</div>
                      <div className="text-sm text-gray-500">ID: {collection.customerId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{collection.amountPaid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {collection.collectorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {collection.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{collection.balanceRemaining.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(collection.amountPaid)}`}>
                      {getPaymentStatusText(collection.amountPaid)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(collection)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Export to Excel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Export to PDF
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Print Collection Sheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionManagement;

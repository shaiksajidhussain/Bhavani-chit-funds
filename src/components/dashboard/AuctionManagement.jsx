import React, { useState } from 'react';

const AuctionManagement = () => {
  const [showAuctionForm, setShowAuctionForm] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState('all');

  // Static auction data
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      chitScheme: '₹5,00,000 - 30 months',
      chitValue: 500000,
      auctionDate: '2024-12-10',
      winningMember: 'Rajesh Kumar',
      memberId: 'C001',
      amountReceived: 500000,
      discountAmount: 0,
      newDailyPayment: 500,
      previousDailyPayment: 500,
      status: 'Completed',
      remarks: 'Full amount received'
    },
    {
      id: 2,
      chitScheme: '₹5,00,000 - 200 days',
      chitValue: 500000,
      auctionDate: '2024-12-08',
      winningMember: 'Priya Sharma',
      memberId: 'C002',
      amountReceived: 450000,
      discountAmount: 50000,
      newDailyPayment: 3000,
      previousDailyPayment: 2500,
      status: 'Completed',
      remarks: '₹50,000 discount applied'
    },
    {
      id: 3,
      chitScheme: '₹5,00,000 - 30 months',
      chitValue: 500000,
      auctionDate: '2024-12-15',
      winningMember: 'Amit Singh',
      memberId: 'C003',
      amountReceived: 0,
      discountAmount: 0,
      newDailyPayment: 500,
      previousDailyPayment: 500,
      status: 'Scheduled',
      remarks: 'Upcoming auction'
    }
  ]);

  const [formData, setFormData] = useState({
    chitScheme: '',
    chitValue: '',
    auctionDate: '',
    winningMember: '',
    memberId: '',
    amountReceived: '',
    discountAmount: '',
    newDailyPayment: '',
    previousDailyPayment: '',
    status: 'Scheduled',
    remarks: ''
  });

  const chitSchemes = [
    '₹5,00,000 - 30 months',
    '₹5,00,000 - 200 days',
    '₹3,00,000 - 18 months'
  ];

  const members = [
    { id: 'C001', name: 'Rajesh Kumar' },
    { id: 'C002', name: 'Priya Sharma' },
    { id: 'C003', name: 'Amit Singh' },
    { id: 'C004', name: 'Sunita Patel' }
  ];

  const filteredAuctions = selectedScheme === 'all' 
    ? auctions 
    : auctions.filter(auction => auction.chitScheme === selectedScheme);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAuction) {
      setAuctions(prev => prev.map(auction => 
        auction.id === editingAuction.id ? { ...formData, id: editingAuction.id } : auction
      ));
      setEditingAuction(null);
    } else {
      const newAuction = {
        ...formData,
        id: auctions.length + 1,
        amountReceived: parseInt(formData.amountReceived) || 0,
        discountAmount: parseInt(formData.discountAmount) || 0,
        newDailyPayment: parseInt(formData.newDailyPayment) || 0,
        previousDailyPayment: parseInt(formData.previousDailyPayment) || 0
      };
      setAuctions(prev => [...prev, newAuction]);
    }
    setShowAuctionForm(false);
    setFormData({
      chitScheme: '',
      chitValue: '',
      auctionDate: '',
      winningMember: '',
      memberId: '',
      amountReceived: '',
      discountAmount: '',
      newDailyPayment: '',
      previousDailyPayment: '',
      status: 'Scheduled',
      remarks: ''
    });
  };

  const handleEdit = (auction) => {
    setEditingAuction(auction);
    setFormData(auction);
    setShowAuctionForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this auction record?')) {
      setAuctions(prev => prev.filter(auction => auction.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSchemeStats = () => {
    const stats = {};
    auctions.forEach(auction => {
      if (!stats[auction.chitScheme]) {
        stats[auction.chitScheme] = {
          totalAuctions: 0,
          completedAuctions: 0,
          totalAmount: 0
        };
      }
      stats[auction.chitScheme].totalAuctions++;
      if (auction.status === 'Completed') {
        stats[auction.chitScheme].completedAuctions++;
        stats[auction.chitScheme].totalAmount += auction.amountReceived;
      }
    });
    return stats;
  };

  const schemeStats = getSchemeStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Auction & Lifting Management</h1>
        <button
          onClick={() => setShowAuctionForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Schedule Auction
        </button>
      </div>

      {/* Scheme Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(schemeStats).map(([scheme, stats]) => (
          <div key={scheme} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{scheme}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Auctions:</span>
                <span className="font-medium">{stats.totalAuctions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">{stats.completedAuctions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="font-medium">₹{stats.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Scheme:</label>
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Schemes</option>
            {chitSchemes.map((scheme, index) => (
              <option key={index} value={scheme}>{scheme}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Auction Form Modal */}
      {showAuctionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingAuction ? 'Edit Auction' : 'Schedule New Auction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chit Scheme</label>
                  <select
                    name="chitScheme"
                    value={formData.chitScheme}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Scheme</option>
                    {chitSchemes.map((scheme, index) => (
                      <option key={index} value={scheme}>{scheme}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chit Value (₹)</label>
                  <input
                    type="number"
                    name="chitValue"
                    value={formData.chitValue}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auction Date</label>
                  <input
                    type="date"
                    name="auctionDate"
                    value={formData.auctionDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Winning Member</label>
                  <select
                    name="winningMember"
                    value={formData.winningMember}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                  <input
                    type="text"
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    name="amountReceived"
                    value={formData.amountReceived}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Daily Payment (₹)</label>
                  <input
                    type="number"
                    name="previousDailyPayment"
                    value={formData.previousDailyPayment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Daily Payment (₹)</label>
                  <input
                    type="number"
                    name="newDailyPayment"
                    value={formData.newDailyPayment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                  placeholder="Enter any remarks about the auction..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuctionForm(false);
                    setEditingAuction(null);
                    setFormData({
                      chitScheme: '',
                      chitValue: '',
                      auctionDate: '',
                      winningMember: '',
                      memberId: '',
                      amountReceived: '',
                      discountAmount: '',
                      newDailyPayment: '',
                      previousDailyPayment: '',
                      status: 'Scheduled',
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
                  {editingAuction ? 'Update Auction' : 'Schedule Auction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auction History Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Auction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winning Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAuctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{auction.chitScheme}</div>
                      <div className="text-sm text-gray-500">Value: ₹{auction.chitValue.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(auction.auctionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{auction.winningMember}</div>
                      <div className="text-sm text-gray-500">ID: {auction.memberId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{auction.amountReceived.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{auction.discountAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{auction.newDailyPayment.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(auction.status)}`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(auction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(auction.id)}
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
    </div>
  );
};

export default AuctionManagement;

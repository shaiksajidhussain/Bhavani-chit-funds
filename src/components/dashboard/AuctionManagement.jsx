import React, { useState, useEffect } from 'react';
import useAuctionStore from '../../stores/auctionStore';

const AuctionManagement = () => {
  const {
    auctions,
    chitSchemes,
    members,
    loading,
    error,
    showCreateForm,
    editingAuction,
    formData,
    setShowCreateForm,
    setEditingAuction,
    setFormData,
    resetForm,
    clearError,
    fetchAuctions,
    fetchChitSchemes,
    fetchMembers,
    createAuction,
    updateAuction,
    deleteAuction
  } = useAuctionStore();

  const [selectedScheme, setSelectedScheme] = useState('all');

  // Load data on component mount
  useEffect(() => {
    fetchAuctions();
    fetchChitSchemes();
    fetchMembers();
  }, [fetchAuctions, fetchChitSchemes, fetchMembers]);

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
    console.log('Form data type:', typeof formData);
    console.log('Form data is object:', formData && typeof formData === 'object');
    console.log('Form data keys:', formData && typeof formData === 'object' ? Object.keys(formData) : 'Not an object');
  }, [formData]);

  // Debug loaded data
  useEffect(() => {
    console.log('Chit schemes loaded:', chitSchemes);
    console.log('Members loaded:', members);
  }, [chitSchemes, members]);

  // Filter auctions based on selected scheme
  const filteredAuctions = selectedScheme === 'all' 
    ? auctions 
    : auctions.filter(auction => auction.chitScheme?.id === selectedScheme);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    
    // Get current form data from store
    const currentFormData = useAuctionStore.getState().formData;
    
    // Auto-populate member ID when member is selected
    if (name === 'winningMemberId') {
      const selectedMember = members.find(member => member.id === value);
      console.log('Selected member:', selectedMember);
      const newData = {
        ...currentFormData,
        [name]: value,
        memberId: selectedMember?.id || ''
      };
      console.log('Updated form data:', newData);
      setFormData(newData);
    } 
    // Auto-populate chit value when scheme is selected
    else if (name === 'chitSchemeId') {
      const selectedScheme = chitSchemes.find(scheme => scheme.id === value);
      console.log('Selected scheme:', selectedScheme);
      const newData = {
        ...currentFormData,
        [name]: value,
        chitValue: selectedScheme?.chitValue || ''
      };
      console.log('Updated form data:', newData);
      setFormData(newData);
    } 
    else {
      const newData = {
        ...currentFormData,
        [name]: value
      };
      console.log('Updated form data:', newData);
      setFormData(newData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the current form data from the store
    const currentFormData = useAuctionStore.getState().formData;
    console.log('Form data before submission:', currentFormData);
    console.log('Form data keys:', Object.keys(currentFormData));
    console.log('Form data values:', Object.values(currentFormData));
    console.log('Chit schemes available:', chitSchemes);
    console.log('Members available:', members);
    
    // Check if form data is empty
    if (!currentFormData.chitSchemeId) {
      alert('Please select a chit scheme');
      return;
    }
    if (!currentFormData.auctionDate) {
      alert('Please select an auction date');
      return;
    }
    
    try {
      if (editingAuction) {
        await updateAuction(editingAuction.id, currentFormData);
        setEditingAuction(null);
      } else {
        await createAuction(currentFormData);
      }
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting auction:', error);
      // Error is handled by the store
    }
  };

  const handleEdit = (auction) => {
    setEditingAuction(auction);
    setFormData({
      chitSchemeId: auction.chitSchemeId || '',
      chitValue: auction.chitScheme?.chitValue || '',
      auctionDate: auction.auctionDate ? new Date(auction.auctionDate).toISOString().split('T')[0] : '',
      winningMemberId: auction.winningMemberId || '',
      memberId: auction.winningMember?.id || '',
      amountReceived: auction.amountReceived || '',
      discountAmount: auction.discountAmount || '',
      newDailyPayment: auction.newDailyPayment || '',
      previousDailyPayment: auction.previousDailyPayment || '',
      status: auction.status || 'SCHEDULED',
      remarks: auction.remarks || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this auction record?')) {
      try {
        await deleteAuction(id);
      } catch (error) {
        console.error('Error deleting auction:', error);
        // Error is handled by the store
      }
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
      const schemeName = auction.chitScheme?.name || 'Unknown Scheme';
      if (!stats[schemeName]) {
        stats[schemeName] = {
          totalAuctions: 0,
          completedAuctions: 0,
          totalAmount: 0
        };
      }
      stats[schemeName].totalAuctions++;
      if (auction.status === 'COMPLETED') {
        stats[schemeName].completedAuctions++;
        stats[schemeName].totalAmount += auction.amountReceived || 0;
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
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Schedule Auction
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={clearError}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

   

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
            {chitSchemes.map((scheme) => (
              <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Auction Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingAuction ? 'Edit Auction' : 'Schedule New Auction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chit Scheme
                    {editingAuction && <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>}
                  </label>
                  <select
                    name="chitSchemeId"
                    value={formData.chitSchemeId}
                    onChange={handleInputChange}  
                    required
                    disabled={editingAuction}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editingAuction ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Scheme</option>
                    {chitSchemes.map((scheme) => (
                      <option key={scheme.id} value={scheme.id}>
                        {scheme.name} (ID: {scheme.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chit Value (₹)</label>
                  <input
                    type="number"
                    name="chitValue"
                    value={formData.chitValue || (formData.chitSchemeId ? chitSchemes.find(s => s.id === formData.chitSchemeId)?.chitValue : '') || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auction Date</label>
                  <input
                    type="date"
                    name="auctionDate"
                    value={formData.auctionDate || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || 'SCHEDULED'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Winning Member</label>
                  <select
                    name="winningMemberId"
                    value={formData.winningMemberId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} (ID: {member.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                  <input
                    type="text"
                    name="memberId"
                    value={formData.memberId || (formData.winningMemberId ? members.find(m => m.id === formData.winningMemberId)?.id : '') || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    name="amountReceived"
                    value={formData.amountReceived || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount || ''}
                    onChange={handleInputChange}
                    min="0"
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
                    value={formData.previousDailyPayment || ''}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Daily Payment (₹)</label>
                  <input
                    type="number"
                    name="newDailyPayment"
                    value={formData.newDailyPayment || ''}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks || ''}
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
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (editingAuction ? 'Update Auction' : 'Schedule Auction')}
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Loading auctions...
                  </td>
                </tr>
              ) : filteredAuctions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No auctions found
                  </td>
                </tr>
              ) : (
                filteredAuctions.map((auction) => (
                  <tr key={auction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{auction.chitScheme?.name || 'Unknown Scheme'}</div>
                        <div className="text-sm text-gray-500">Value: ₹{auction.chitScheme?.chitValue?.toLocaleString() || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {auction.auctionDate ? new Date(auction.auctionDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{auction.winningMember?.name || 'No Member'}</div>
                        <div className="text-sm text-gray-500">ID: {auction.winningMember?.id || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(auction.amountReceived || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(auction.discountAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(auction.newDailyPayment || 0).toLocaleString()}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuctionManagement;

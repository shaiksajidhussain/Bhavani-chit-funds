import React, { useState, useEffect } from 'react';
import { useChitSchemeStore } from '../../stores/chitSchemeStore';

const ChitSchemeManagement = () => {
  // Zustand store
  const {
    schemes,
    loading,
    error,
    selectedScheme,
    showCreateForm,
    editingScheme,
    showMembersModal,
    fetchSchemes,
    createScheme,
    updateScheme,
    deleteScheme,
    setShowCreateForm,
    setEditingScheme,
    setShowMembersModal,
    setSelectedScheme,
    resetForm
  } = useChitSchemeStore();

  const [formData, setFormData] = useState({
    name: '',
    chitValue: '',
    duration: '',
    durationType: 'months',
    dailyPayment: '',
    monthlyPayment: '',
    numberOfMembers: '',
    auctionRules: '',
    status: 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0],
    lastDate: ''
  });

  // Fetch schemes on component mount
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        await fetchSchemes();
      } catch (error) {
        console.error('Error loading schemes:', error);
      }
    };
    loadSchemes();
  }, [fetchSchemes]);

  // Ensure schemes is always an array
  const safeSchemes = Array.isArray(schemes) ? schemes : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const schemeData = {
        ...formData,
        chitValue: parseInt(formData.chitValue),
        duration: parseInt(formData.duration),
        durationType: formData.durationType.toUpperCase(), // Convert to uppercase
        dailyPayment: parseInt(formData.dailyPayment),
        monthlyPayment: parseInt(formData.monthlyPayment),
        numberOfMembers: parseInt(formData.numberOfMembers),
        startDate: formData.startDate,
        lastDate: formData.lastDate || null,
        status: formData.status
      };

      if (editingScheme) {
        await updateScheme(editingScheme.id, schemeData);
      } else {
        await createScheme(schemeData);
      }
      
      resetForm();
      setFormData({
        name: '',
        chitValue: '',
        duration: '',
        durationType: 'months',
        dailyPayment: '',
        monthlyPayment: '',
        numberOfMembers: '',
        auctionRules: '',
        status: 'ACTIVE',
        startDate: new Date().toISOString().split('T')[0],
        lastDate: ''
      });
    } catch (error) {
      console.error('Error saving scheme:', error);
    }
  };


  const handleEdit = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name,
      chitValue: scheme.chitValue.toString(),
      duration: scheme.duration.toString(),
      durationType: scheme.durationType ? scheme.durationType.toLowerCase() : 'months',
      dailyPayment: scheme.dailyPayment.toString(),
      monthlyPayment: scheme.monthlyPayment.toString(),
      numberOfMembers: scheme.numberOfMembers.toString(),
      auctionRules: scheme.auctionRules || '',
      status: scheme.status,
      startDate: scheme.startDate ? new Date(scheme.startDate).toISOString().split('T')[0] : '',
      lastDate: scheme.lastDate ? new Date(scheme.lastDate).toISOString().split('T')[0] : ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chit scheme?')) {
      try {
        await deleteScheme(id);
      } catch (error) {
        console.error('Error deleting scheme:', error);
      }
    }
  };

  const handleViewMembers = (scheme) => {
    setSelectedScheme(scheme);
    setShowMembersModal(true);
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') {
      return 'bg-gray-100 text-gray-800';
    }
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (enrolled, total) => {
    if (!enrolled || !total || total === 0) return 0;
    return Math.round((enrolled / total) * 100);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Chit Scheme Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create New Scheme
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Predefined Schemes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Predefined Schemes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900">₹5,00,000 - 30 months</h3>
            <p className="text-sm text-gray-600">₹500 daily - 30 members</p>
            <div className="mt-2 text-xs text-gray-500">
              <p>Total Value: ₹5,00,000</p>
              <p>Monthly Payment: ₹15,000</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900">₹5,00,000 - 200 days</h3>
            <p className="text-sm text-gray-600">₹2500 daily - 20 members</p>
            <div className="mt-2 text-xs text-gray-500">
              <p>Total Value: ₹5,00,000</p>
              <p>After Lifting: ₹3000 daily</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900">Custom Scheme</h3>
            <p className="text-sm text-gray-600">Create your own scheme</p>
            <div className="mt-2 text-xs text-gray-500">
              <p>Flexible parameters</p>
              <p>Custom rules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingScheme ? 'Edit Chit Scheme' : 'Create New Chit Scheme'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ₹5,00,000 - 30 months"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Members</label>
                  <input
                    type="number"
                    name="numberOfMembers"
                    value={formData.numberOfMembers}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Date</label>
                  <input
                    type="date"
                    name="lastDate"
                    value={formData.lastDate}
                    onChange={handleInputChange}
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
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration Type</label>
                  <select
                    name="durationType"
                    value={formData.durationType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Payment (₹)</label>
                  <input
                    type="number"
                    name="dailyPayment"
                    value={formData.dailyPayment}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment (₹)</label>
                  <input
                    type="number"
                    name="monthlyPayment"
                    value={formData.monthlyPayment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auction/Lifting Rules</label>
                <textarea
                  name="auctionRules"
                  value={formData.auctionRules}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Before lifting: ₹500 daily, After lifting: ₹500 daily"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setFormData({
                      name: '',
                      chitValue: '',
                      duration: '',
                      durationType: 'months',
                      dailyPayment: '',
                      monthlyPayment: '',
                      numberOfMembers: '',
                      auctionRules: '',
                      status: 'ACTIVE',
                      startDate: new Date().toISOString().split('T')[0],
                      lastDate: ''
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
                  {editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schemes Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeSchemes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    {loading ? 'Loading schemes...' : 'No chit schemes found. Create your first scheme!'}
                  </td>
                </tr>
              ) : (
                safeSchemes.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <button
                        onClick={() => handleViewMembers(scheme)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline cursor-pointer"
                      >
                        {scheme.name}
                      </button>
                      <div className="text-sm text-gray-500">ID: {scheme.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(scheme.chitValue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scheme.duration || 0} {scheme.durationType ? scheme.durationType.toLowerCase() : 'months'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(scheme.dailyPayment || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scheme.lastDate ? new Date(scheme.lastDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scheme.membersEnrolled || 0}/{scheme.numberOfMembers || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getProgressPercentage(scheme.membersEnrolled, scheme.numberOfMembers)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {getProgressPercentage(scheme.membersEnrolled, scheme.numberOfMembers)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(scheme.status)}`}>
                      {scheme.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(scheme)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(scheme.id)}
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

      {/* Members Modal */}
      {showMembersModal && selectedScheme && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Members - {selectedScheme.name}
                </h2>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Scheme Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Scheme ID:</span>
                    <p className="font-medium">{selectedScheme.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Chit Value:</span>
                    <p className="font-medium">₹{(selectedScheme.chitValue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Duration:</span>
                    <p className="font-medium">{selectedScheme.duration || 0} {selectedScheme.durationType ? selectedScheme.durationType.toLowerCase() : 'months'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Daily Payment:</span>
                    <p className="font-medium">₹{(selectedScheme.dailyPayment || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Total Members:</span>
                    <p className="font-medium">{selectedScheme.numberOfMembers || 0}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Enrolled:</span>
                    <p className="font-medium">{selectedScheme.membersEnrolled || 0}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedScheme.status)}`}>
                      {selectedScheme.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Enrolled Members</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                          Member management will be integrated with the Customer Management API.
                          <br />
                          <span className="text-blue-600">Coming soon...</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Total Members</div>
                  <div className="text-2xl font-bold text-blue-900">-</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Active Members</div>
                  <div className="text-2xl font-bold text-green-900">-</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Completed</div>
                  <div className="text-2xl font-bold text-blue-900">-</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600">Defaulted</div>
                  <div className="text-2xl font-bold text-red-900">-</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Export Members List
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Add New Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChitSchemeManagement;

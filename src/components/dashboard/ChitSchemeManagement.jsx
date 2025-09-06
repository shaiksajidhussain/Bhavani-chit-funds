import React, { useState } from 'react';

const ChitSchemeManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Static chit schemes data
  const [schemes, setSchemes] = useState([
    {
      id: 1,
      name: '₹5,00,000 - 30 months',
      chitValue: 500000,
      duration: 30,
      durationType: 'months',
      dailyPayment: 500,
      monthlyPayment: 15000,
      numberOfMembers: 30,
      auctionRules: 'Before lifting: ₹500 daily, After lifting: ₹500 daily',
      status: 'Active',
      membersEnrolled: 25,
      startDate: '2024-01-01',
      endDate: '2026-07-01'
    },
    {
      id: 2,
      name: '₹5,00,000 - 200 days',
      chitValue: 500000,
      duration: 200,
      durationType: 'days',
      dailyPayment: 2500,
      monthlyPayment: 75000,
      numberOfMembers: 20,
      auctionRules: 'Before lifting: ₹2500 daily, After lifting: ₹3000 daily',
      status: 'Active',
      membersEnrolled: 18,
      startDate: '2024-02-01',
      endDate: '2024-08-19'
    },
    {
      id: 3,
      name: '₹3,00,000 - 18 months',
      chitValue: 300000,
      duration: 18,
      durationType: 'months',
      dailyPayment: 300,
      monthlyPayment: 9000,
      numberOfMembers: 25,
      auctionRules: 'Before lifting: ₹300 daily, After lifting: ₹300 daily',
      status: 'Completed',
      membersEnrolled: 25,
      startDate: '2023-01-01',
      endDate: '2024-07-01'
    }
  ]);

  // Static members data for each scheme
  const schemeMembers = {
    1: [ // ₹5,00,000 - 30 months
      { id: 1, name: 'Rajesh Kumar', mobile: '9876543210', group: 'Group A', status: 'Active', amountPaid: 15000, balance: 45000, joinDate: '2024-01-15' },
      { id: 2, name: 'Amit Singh', mobile: '9876543212', group: 'Group A', status: 'Completed', amountPaid: 15000, balance: 0, joinDate: '2023-12-01' },
      { id: 3, name: 'Anita Gupta', mobile: '9876543215', group: 'Group A', status: 'Active', amountPaid: 10000, balance: 40000, joinDate: '2024-02-15' },
      { id: 4, name: 'Vikram Reddy', mobile: '9876543214', group: 'Group B', status: 'Active', amountPaid: 8100, balance: 27000, joinDate: '2024-01-01' },
      { id: 5, name: 'Suresh Kumar', mobile: '9876543216', group: 'Group C', status: 'Active', amountPaid: 5000, balance: 100000, joinDate: '2024-03-01' }
    ],
    2: [ // ₹5,00,000 - 200 days
      { id: 6, name: 'Priya Sharma', mobile: '9876543211', group: 'Group B', status: 'Active', amountPaid: 50000, balance: 125000, joinDate: '2024-02-01' },
      { id: 7, name: 'Sunita Patel', mobile: '9876543213', group: 'Group C', status: 'Defaulted', amountPaid: 60000, balance: 180000, joinDate: '2024-03-15' },
      { id: 8, name: 'Meera Joshi', mobile: '9876543217', group: 'Group B', status: 'Completed', amountPaid: 54000, balance: 0, joinDate: '2023-11-01' }
    ],
    3: [ // ₹3,00,000 - 18 months
      { id: 9, name: 'Deepak Verma', mobile: '9876543218', group: 'Group A', status: 'Active', amountPaid: 9000, balance: 45000, joinDate: '2024-01-01' },
      { id: 10, name: 'Ravi Kumar', mobile: '9876543219', group: 'Group B', status: 'Active', amountPaid: 12000, balance: 42000, joinDate: '2024-02-01' },
      { id: 11, name: 'Sita Devi', mobile: '9876543220', group: 'Group C', status: 'Active', amountPaid: 15000, balance: 39000, joinDate: '2024-03-01' }
    ]
  };

  const [formData, setFormData] = useState({
    name: '',
    chitValue: '',
    duration: '',
    durationType: 'months',
    dailyPayment: '',
    monthlyPayment: '',
    numberOfMembers: '',
    auctionRules: '',
    status: 'Active',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingScheme) {
      setSchemes(prev => prev.map(scheme => 
        scheme.id === editingScheme.id ? { ...formData, id: editingScheme.id } : scheme
      ));
      setEditingScheme(null);
    } else {
      const newScheme = {
        ...formData,
        id: schemes.length + 1,
        membersEnrolled: 0,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: calculateEndDate(formData.startDate || new Date().toISOString().split('T')[0], formData.duration, formData.durationType)
      };
      setSchemes(prev => [...prev, newScheme]);
    }
    setShowCreateForm(false);
    setFormData({
      name: '',
      chitValue: '',
      duration: '',
      durationType: 'months',
      dailyPayment: '',
      monthlyPayment: '',
      numberOfMembers: '',
      auctionRules: '',
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const calculateEndDate = (startDate, duration, durationType) => {
    const start = new Date(startDate);
    if (durationType === 'months') {
      start.setMonth(start.getMonth() + parseInt(duration));
    } else {
      start.setDate(start.getDate() + parseInt(duration));
    }
    return start.toISOString().split('T')[0];
  };

  const handleEdit = (scheme) => {
    setEditingScheme(scheme);
    setFormData(scheme);
    setShowCreateForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this chit scheme?')) {
      setSchemes(prev => prev.filter(scheme => scheme.id !== id));
    }
  };

  const handleViewMembers = (scheme) => {
    setSelectedScheme(scheme);
    setShowMembersModal(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (enrolled, total) => {
    return Math.round((enrolled / total) * 100);
  };

  const getMemberStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
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
                    setShowCreateForm(false);
                    setEditingScheme(null);
                    setFormData({
                      name: '',
                      chitValue: '',
                      duration: '',
                      durationType: 'months',
                      dailyPayment: '',
                      monthlyPayment: '',
                      numberOfMembers: '',
                      auctionRules: '',
                      status: 'Active',
                      startDate: new Date().toISOString().split('T')[0]
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schemes.map((scheme) => (
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
                    ₹{scheme.chitValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scheme.duration} {scheme.durationType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{scheme.dailyPayment.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scheme.membersEnrolled}/{scheme.numberOfMembers}
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
                      {scheme.status}
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
              ))}
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
                    <p className="font-medium">₹{selectedScheme.chitValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Duration:</span>
                    <p className="font-medium">{selectedScheme.duration} {selectedScheme.durationType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Daily Payment:</span>
                    <p className="font-medium">₹{selectedScheme.dailyPayment.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Total Members:</span>
                    <p className="font-medium">{selectedScheme.numberOfMembers}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Enrolled:</span>
                    <p className="font-medium">{selectedScheme.membersEnrolled}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedScheme.status)}`}>
                      {selectedScheme.status}
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
                      {schemeMembers[selectedScheme.id]?.map((member, index) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            M{member.id.toString().padStart(4, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {member.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.mobile}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.group}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(member.joinDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{member.amountPaid.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{member.balance.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMemberStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                            No members enrolled in this scheme yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Statistics */}
              {schemeMembers[selectedScheme.id] && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600">Total Members</div>
                    <div className="text-2xl font-bold text-blue-900">{schemeMembers[selectedScheme.id].length}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600">Active Members</div>
                    <div className="text-2xl font-bold text-green-900">
                      {schemeMembers[selectedScheme.id].filter(m => m.status === 'Active').length}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600">Completed</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {schemeMembers[selectedScheme.id].filter(m => m.status === 'Completed').length}
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-600">Defaulted</div>
                    <div className="text-2xl font-bold text-red-900">
                      {schemeMembers[selectedScheme.id].filter(m => m.status === 'Defaulted').length}
                    </div>
                  </div>
                </div>
              )}

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

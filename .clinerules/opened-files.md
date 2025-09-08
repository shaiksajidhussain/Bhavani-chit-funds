# Opened Files
## File Name
src/components/dashboard/CustomerManagement.jsx
## File Content
import React, { useState } from 'react';

const CustomerManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [showPassbookModal, setShowPassbookModal] = useState(false);
  const [selectedCustomerForPassbook, setSelectedCustomerForPassbook] = useState(null);

  // Static chit schemes data (matching ChitSchemeManagement)
  const chitSchemesData = [
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
  ];

  // Static customer data with scheme IDs
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      mobile: '9876543210',
      address: '123 Main Street, Bangalore',
      schemeId: 1, // References chitSchemesData[0]
      startDate: '2024-01-15',
      amountPerDay: 500,
      duration: 30,
      status: 'Active',
      balance: 45000,
      documents: ['Aadhar Card', 'PAN Card'],
      group: 'Group A'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      mobile: '9876543211',
      address: '456 Park Avenue, Mumbai',
      schemeId: 2, // References chitSchemesData[1]
      startDate: '2024-02-01',
      amountPerDay: 2500,
      duration: 200,
      status: 'Active',
      balance: 125000,
      documents: ['Aadhar Card', 'Bank Passbook'],
      group: 'Group B'
    },
    {
      id: 3,
      name: 'Amit Singh',
      mobile: '9876543212',
      address: '789 Garden Road, Delhi',
      schemeId: 1, // References chitSchemesData[0]
      startDate: '2023-12-01',
      amountPerDay: 500,
      duration: 30,
      status: 'Completed',
      balance: 0,
      documents: ['Aadhar Card', 'PAN Card', 'Voter ID'],
      group: 'Group A'
    },
    {
      id: 4,
      name: 'Sunita Patel',
      mobile: '9876543213',
      address: '321 Lake View, Pune',
      schemeId: 2, // References chitSchemesData[1]
      startDate: '2024-03-15',
      amountPerDay: 3000,
      duration: 200,
      status: 'Defaulted',
      balance: 180000,
      documents: ['Aadhar Card'],
      group: 'Group C'
    },
    {
      id: 5,
      name: 'Vikram Reddy',
      mobile: '9876543214',
      address: '555 Tech Park, Hyderabad',
      schemeId: 3, // References chitSchemesData[2]
      startDate: '2024-01-01',
      amountPerDay: 300,
      duration: 18,
      status: 'Active',
      balance: 27000,
      documents: ['Aadhar Card', 'PAN Card'],
      group: 'Group B'
    },
    {
      id: 6,
      name: 'Anita Gupta',
      mobile: '9876543215',
      address: '777 Business Center, Chennai',
      schemeId: 1, // References chitSchemesData[0]
      startDate: '2024-02-15',
      amountPerDay: 500,
      duration: 30,
      status: 'Active',
      balance: 40000,
      documents: ['Aadhar Card', 'Bank Passbook'],
      group: 'Group A'
    },
    {
      id: 7,
      name: 'Suresh Kumar',
      mobile: '9876543216',
      address: '999 Mall Road, Kolkata',
      schemeId: 2, // References chitSchemesData[1]
      startDate: '2024-03-01',
      amountPerDay: 2500,
      duration: 200,
      status: 'Active',
      balance: 100000,
      documents: ['Aadhar Card', 'PAN Card', 'Voter ID'],
      group: 'Group C'
    },
    {
      id: 8,
      name: 'Meera Joshi',
      mobile: '9876543217',
      address: '111 Hill Station, Shimla',
      schemeId: 3, // References chitSchemesData[2]
      startDate: '2023-11-01',
      amountPerDay: 300,
      duration: 18,
      status: 'Completed',
      balance: 0,
      documents: ['Aadhar Card', 'PAN Card'],
      group: 'Group B'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    schemeId: '',
    startDate: '',
    amountPerDay: '',
    duration: '',
    status: 'Active',
    group: 'Group A',
    documents: []
  });

  const groups = ['Group A', 'Group B', 'Group C'];

  // Helper function to get scheme name by ID
  const getSchemeName = (schemeId) => {
    const scheme = chitSchemesData.find(s => s.id === schemeId);
    return scheme ? scheme.name : 'Unknown Scheme';
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesGroup = groupFilter === 'all' || customer.group === groupFilter;
    const matchesScheme = schemeFilter === 'all' || customer.schemeId.toString() === schemeFilter;
    return matchesSearch && matchesStatus && matchesGroup && matchesScheme;
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
    if (editingCustomer) {
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id ? { ...formData, id: editingCustomer.id } : customer
      ));
      setEditingCustomer(null);
    } else {
      const newCustomer = {
        ...formData,
        id: customers.length + 1,
        balance: formData.amountPerDay * formData.duration
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    setShowAddForm(false);
    setFormData({
      name: '',
      mobile: '',
      address: '',
      schemeId: '',
      startDate: '',
      amountPerDay: '',
      duration: '',
      status: 'Active',
      group: 'Group A',
      documents: []
    });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    }
  };

  const handleViewPassbook = (customer) => {
    setSelectedCustomerForPassbook(customer);
    setShowPassbookModal(true);
  };

  const getStatusColor = (status) => {
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
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Customer
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:w-auto">
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="defaulted">Defaulted</option>
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Groups</option>
                {groups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={schemeFilter}
                onChange={(e) => setSchemeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Schemes</option>
                {chitSchemesData.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setGroupFilter('all');
                setSchemeFilter('all');
              }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chit Scheme</label>
                  <select
                    name="schemeId"
                    value={formData.schemeId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Scheme</option>
                    {chitSchemesData.map((scheme) => (
                      <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
                    ))}
                  </select>
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                  <select
                    name="group"
                    value={formData.group}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {groups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
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
                    <option value="Completed">Completed</option>
                    <option value="Defaulted">Defaulted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount per Day</label>
                  <input
                    type="number"
                    name="amountPerDay"
                    value={formData.amountPerDay}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days/Months)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCustomer(null);
                    setFormData({
                      name: '',
                      mobile: '',
                      address: '',
                      schemeId: '',
                      startDate: '',
                      amountPerDay: '',
                      duration: '',
                      status: 'Active',
                      group: 'Group A',
                      documents: []
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
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Group Statistics */}
        {groups.map((group) => {
          const groupCustomers = customers.filter(customer => customer.group === group);
          const activeCustomers = groupCustomers.filter(customer => customer.status === 'Active').length;
          const totalBalance = groupCustomers.reduce((sum, customer) => sum + customer.balance, 0);
          
          return (
            <div key={group} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{group}</p>
                  <p className="text-2xl font-bold text-gray-900">{groupCustomers.length}</p>
                  <p className="text-sm text-gray-500">{activeCustomers} active</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Balance</p>
                  <p className="text-lg font-semibold text-gray-900">₹{totalBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Scheme Statistics */}
        {chitSchemesData.map((scheme) => {
          const schemeCustomers = customers.filter(customer => customer.schemeId === scheme.id);
          const activeCustomers = schemeCustomers.filter(customer => customer.status === 'Active').length;
          const totalBalance = schemeCustomers.reduce((sum, customer) => sum + customer.balance, 0);
          
          return (
            <div key={scheme.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{scheme.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{schemeCustomers.length}</p>
                  <p className="text-sm text-gray-500">{activeCustomers} active</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Balance</p>
                  <p className="text-lg font-semibold text-gray-900">₹{totalBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Chit Group:</label>
              <select 
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Groups</option>
                {groups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chit Scheme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chit Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    M{customer.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button
                      onClick={() => handleViewPassbook(customer)}
                      className="text-blue-600 hover:text-blue-900 hover:underline cursor-pointer"
                    >
                      {customer.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getSchemeName(customer.schemeId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.group}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(customer.amountPerDay * customer.duration - customer.balance).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{customer.balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
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

      {/* Passbook Modal */}
      {showPassbookModal && selectedCustomerForPassbook && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Passbook - {selectedCustomerForPassbook.name}
                </h2>
                <button
                  onClick={() => setShowPassbookModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Customer Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Customer ID:</span>
                    <p className="font-medium">M{selectedCustomerForPassbook.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedCustomerForPassbook.mobile}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Chit Scheme:</span>
                    <p className="font-medium">{getSchemeName(selectedCustomerForPassbook.schemeId)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomerForPassbook.status)}`}>
                      {selectedCustomerForPassbook.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Schedule Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Schedule</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chitti Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from({ length: Math.min(selectedCustomerForPassbook.duration, 10) }, (_, index) => {
                        const month = index + 1;
                        const dailyPayment = selectedCustomerForPassbook.amountPerDay;
                        const amount = dailyPayment * 30; // Assuming 30 days per month
                        const chittiAmount = 500000 + (Math.floor(month / 2) * 10000);
                        
                        // Calculate date based on start date
                        const startDate = new Date(selectedCustomerForPassbook.startDate);
                        const monthDate = new Date(startDate);
                        monthDate.setMonth(startDate.getMonth() + index);
                        
                        return (
                          <tr key={month} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {monthDate.toLocaleDateString('en-GB')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{dailyPayment.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{chittiAmount.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Passbook Entries */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collector</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signature</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Sample passbook entries for this customer */}
                      {(() => {
                        const startDate = new Date(selectedCustomerForPassbook.startDate);
                        const entries = [];
                        
                        // Generate entries for the last 10 days
                        for (let i = 0; i < 10; i++) {
                          const entryDate = new Date(startDate);
                          entryDate.setDate(startDate.getDate() + i);
                          
                          entries.push({
                            id: i + 1,
                            date: entryDate.toISOString().split('T')[0],
                            amountPaid: selectedCustomerForPassbook.amountPerDay,
                            balance: selectedCustomerForPassbook.balance + (i * selectedCustomerForPassbook.amountPerDay),
                            paymentMethod: i % 3 === 0 ? 'Cash' : i % 3 === 1 ? 'UPI' : 'Bank Transfer',
                            collectorName: i % 2 === 0 ? 'Amit Singh' : 'Priya Sharma',
                            signature: i < 8 ? 'Approved' : i === 8 ? 'Pending' : 'Rejected'
                          });
                        }
                        
                        return entries;
                      })().map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(entry.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{entry.amountPaid.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{entry.balance.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.collectorName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              entry.signature === 'Approved' ? 'text-green-600' : 
                              entry.signature === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {entry.signature}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Print Options */}
              <div className="mt-6 flex justify-end space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Print Passbook
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Export to PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

# Opened Files
## File Name
src/components/dashboard/Reports.jsx
## File Content
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
    },
    customer: {
      totalCollection: 2500000,
      paidMembers: 150,
      pendingMembers: 25,
      defaulters: 8,
      collectionRate: 82.1
    },
    scheme: {
      totalCollection: 5000000,
      paidMembers: 200,
      pendingMembers: 30,
      defaulters: 12,
      collectionRate: 87.3
    }
  };

  const currentData = reportData[selectedReport] || {
    totalCollection: 0,
    paidMembers: 0,
    pendingMembers: 0,
    defaulters: 0,
    collectionRate: 0
  };

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

# Opened Files
## File Name
src/components/Dashboard.jsx
## File Content
import React, { useState } from 'react';
import AdminDashboard from './dashboard/AdminDashboard';
import CustomerManagement from './dashboard/CustomerManagement';
import ChitSchemeManagement from './dashboard/ChitSchemeManagement';
import CollectionManagement from './dashboard/CollectionManagement';
import AuctionManagement from './dashboard/AuctionManagement';
// import Reports from './dashboard/Reports';
// import PassbookSystem from './dashboard/PassbookSystem';
// import AgentDashboard from './dashboard/AgentDashboard';
import DashboardSidebar from './dashboard/DashboardSidebar';
import Reports from './dashboard/Reports';
import PassbookSystem from './dashboard/PassbookSystem';
import Navbar from './Navbar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userType, setUserType] = useState('admin'); // admin, agent, customer

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'schemes':
        return <ChitSchemeManagement />;
      case 'collections':
        return <CollectionManagement />;
      case 'auctions':
        return <AuctionManagement />;
      case 'reports':
        return <Reports />;
      case 'passbook':
        return <PassbookSystem />;
      case 'agent':
        return <AgentDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <>
      {/* <Navbar /> */}
    <div className="min-h-screen bg-gray-50">
      <div className="flex ">
        <DashboardSidebar className="z-[99999]" 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          userType={userType}
        />
        <div className="flex-1 ml-64">
          <div className="p-6">
            {renderContent()}
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

# Opened Files
## File Name
src/components/Navbar.jsx
## File Content
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 16;
      
      if (navbarRef.current) {
        if (scrolled) {
          navbarRef.current.classList.add('nav-scrolled');
        } else {
          navbarRef.current.classList.remove('nav-scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animate navbar links on mount
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-link', 
        { opacity: 0, y: -20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }, navbarRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (mobileMenuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, x: '100%' },
        { opacity: 1, x: '0%', duration: 0.4, ease: "power2.out" }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        x: '100%',
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = (type) => {
    if (type === 'Admin') {
      window.location.href = '/dashboard';
    } else {
      alert(`${type} login functionality coming soon!`);
    }
  };

  return (
    <nav 
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dgus6y6lm/image/upload/v1756502505/bhavanilogo_jjef0a.jpg"
              alt="Bhavani Chit Funds Logo"
              className="h-12 lg:h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Home
            </a>
            <a 
              href="#schemes" 
              onClick={(e) => { e.preventDefault(); scrollToSection('schemes'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Schemes
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              How It Works
            </a>
            <a 
              href="#features" 
              onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Features
            </a>
            <a 
              href="#reports" 
              onClick={(e) => { e.preventDefault(); scrollToSection('reports'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Reports
            </a>
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Contact
            </a>
            <Link 
              to="/dashboard"
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Dashboard
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => handleLogin('Client')}
              className="px-5 py-2.5 text-sm font-medium text-violet-600 border border-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:text-violet-400 dark:border-violet-400 dark:hover:bg-violet-400 dark:hover:text-gray-900"
            >
              Client Login
            </button>
            <button
              onClick={() => handleLogin('Admin')}
              className="px-5 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40 mobile-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed left-0 right-0 top-16 bottom-0 bg-white dark:bg-gray-900 z-50 shadow-2xl border-t border-gray-200 dark:border-gray-700 mobile-menu-overlay"
            style={{ 
              backgroundColor: 'var(--tw-bg-opacity, 1)',
              '--tw-bg-opacity': '1',
              zIndex: 9999,
              height: 'calc(100vh - 4rem)'
            }}
          >
            <div className="flex flex-col h-full w-full">
              <div className="flex-1 px-4 py-8 space-y-6">
                <a 
                  href="#home" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Home
                </a>
                <a 
                  href="#schemes" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('schemes'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Schemes
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  How It Works
                </a>
                <a 
                  href="#features" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Features
                </a>
                <a 
                  href="#reports" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('reports'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Reports
                </a>
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Contact
                </a>
                <Link 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Dashboard
                </Link>
              </div>
              
              <div className="px-4 py-8 space-y-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => handleLogin('Client')}
                  className="w-full px-5 py-3 text-sm font-medium text-violet-600 border border-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all duration-200 dark:text-violet-400 dark:border-violet-400 dark:hover:bg-violet-400 dark:hover:text-gray-900 hover:shadow-md"
                >
                  Client Login
                </button>
                <button
                  onClick={() => handleLogin('Admin')}
                  className="w-full px-5 py-3 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all duration-200 dark:bg-violet-500 dark:hover:bg-violet-600 hover:shadow-md"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .nav-scrolled {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .dark .nav-scrolled {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;


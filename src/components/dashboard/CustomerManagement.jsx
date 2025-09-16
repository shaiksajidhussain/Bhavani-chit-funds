import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCustomerStore from '../../stores/customerStore';
import usePassbookStore from '../../stores/passbookStore';
import { fileToBase64 } from '../../utils/imageUtils';

const CustomerManagement = () => {
  // Customer store
  const {
    customers,
    chitSchemes,
    loading,
    error,
    selectedCustomer,
    showCreateForm,
    editingCustomer,
    showPassbookModal,
    setShowCreateForm,
    setEditingCustomer,
    setShowPassbookModal,
    setSelectedCustomer,
    resetForm,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchChitSchemes
  } = useCustomerStore();

  // Passbook store
  const {
    entries: passbookEntries,
    loading: passbookLoading,
    error: passbookError,
    showAddForm: showPassbookForm,
    formData: passbookFormData,
    setShowAddForm: setShowPassbookForm,
    setFormData: setPassbookFormData,
    resetForm: resetPassbookForm,
    fetchPassbookEntries,
    createPassbookEntry,
    updatePassbookEntry,
    deletePassbookEntry,
    clearError: clearPassbookError
  } = usePassbookStore();

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [editingPassbookEntry, setEditingPassbookEntry] = useState(null);
  
  // Local loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPassbookSubmitting, setIsPassbookSubmitting] = useState(false);
  const [isPassbookDeleting, setIsPassbookDeleting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    schemeId: '',
    startDate: '',
    lastDate: '',
    amountPerDay: '',
    duration: '',
    durationType: 'MONTHS',
    status: 'ACTIVE',
    photo: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCustomers(),
          fetchChitSchemes()
        ]);
      } catch (error) {
        handleApiError(error, 'Failed to load data');
      }
    };

    loadData();
  }, [fetchCustomers, fetchChitSchemes]);

  // Fetch customers when filters change
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (schemeFilter !== 'all') params.schemeId = schemeFilter;

    fetchCustomers(params);
  }, [searchTerm, statusFilter, schemeFilter, fetchCustomers]);


  // Helper function to get scheme name by ID
  const getSchemeName = (schemeId) => {
    const scheme = chitSchemes.find(s => s.id === schemeId);
    return scheme ? scheme.name : 'Unknown Scheme';
  };

  // Helper function to handle API errors and show toast notifications
  const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    
    if (error.response?.data) {
      const { success, message, errors } = error.response.data;
      
      if (!success && errors && Array.isArray(errors)) {
        // Handle validation errors - show each error message
        errors.forEach(errorItem => {
          const fieldName = errorItem.path || 'Field';
          const errorMessage = errorItem.msg || 'Invalid value';
          toast.error(`${fieldName}: ${errorMessage}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
      } else if (message) {
        // Handle general error messages
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(defaultMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else if (error.message) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(defaultMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Helper function to show success messages
  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Safe customers array
  const safeCustomers = Array.isArray(customers) ? customers : [];

  // Since we're fetching filtered data from API, we can use safeCustomers directly
  const filteredCustomers = safeCustomers;

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && name === 'photo') {
      const file = files[0];
      if (file) {
        console.log('File selected:', file);
        console.log('File type:', file.type);
        console.log('File size:', file.size);
        console.log('File name:', file.name);
        
        try {
          // Convert file to Base64 using utility function
          const base64String = await fileToBase64(file);
          console.log('Base64 conversion successful');
          console.log('Base64 starts with:', base64String.substring(0, 50));
          console.log('Base64 length:', base64String.length);
          
          setFormData(prev => ({
            ...prev,
            [name]: base64String
          }));
        } catch (error) {
          console.error('Error converting file to Base64:', error);
        }
      }
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Debug: Log the photo data
      console.log('Photo data:', formData.photo);
      console.log('Photo type:', typeof formData.photo);
      console.log('Photo length:', formData.photo?.length);
      
      // Skip photo validation for now to test the API
      console.log('Skipping photo validation for testing');

      // Prepare data for API - only send valid schema fields
      const dataToSend = {
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        schemeId: formData.schemeId,
        startDate: formData.startDate,
        lastDate: formData.lastDate || null,
        amountPerDay: parseInt(formData.amountPerDay) || 0,
        duration: parseInt(formData.duration) || 0,
        durationType: formData.durationType?.toUpperCase() || 'MONTHS',
        status: formData.status,
        photo: formData.photo || null
      };

      console.log('Form data before conversion:', formData);
      console.log('Data after conversion:', dataToSend);
      console.log('Data types:', {
        amountPerDay: typeof dataToSend.amountPerDay,
        duration: typeof dataToSend.duration,
        photo: typeof dataToSend.photo
      });

    if (editingCustomer) {
        await updateCustomer(editingCustomer.id, dataToSend);
      setEditingCustomer(null);
        showSuccessMessage('Customer updated successfully!');
    } else {
        await createCustomer(dataToSend);
        showSuccessMessage('Customer created successfully!');
        // Refresh the customer list after creation
        await fetchCustomers();
      }
      setShowCreateForm(false);
      resetForm();
    setFormData({
      name: '',
      mobile: '',
      address: '',
      schemeId: '',
      startDate: '',
        lastDate: '',
      amountPerDay: '',
      duration: '',
        durationType: 'MONTHS',
        status: 'ACTIVE',
        photo: ''
    });
    } catch (error) {
      handleApiError(error, 'Failed to save customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      ...customer,
      durationType: customer.durationType?.toLowerCase() || 'months',
      photo: customer.photo || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setIsDeleting(true);
      try {
        await deleteCustomer(id);
        showSuccessMessage('Customer deleted successfully!');
        // Refresh the customer list after deletion
        await fetchCustomers();
      } catch (error) {
        handleApiError(error, 'Failed to delete customer');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleViewPassbook = async (customer) => {
    setSelectedCustomer(customer);
    setShowPassbookModal(true);
    
    // Fetch passbook entries for this customer
    try {
      await fetchPassbookEntries(customer.id);
    } catch (error) {
      handleApiError(error, 'Failed to load passbook entries');
    }
  };

  const handlePassbookInputChange = (e) => {
    const { name, value } = e.target;
    setPassbookFormData({
      ...passbookFormData,
      [name]: value
    });
  };

  const handlePassbookSubmit = async (e) => {
    e.preventDefault();
    if (selectedCustomer) {
      setIsPassbookSubmitting(true);
      try {
        if (editingPassbookEntry) {
          await updatePassbookEntry(selectedCustomer.id, passbookFormData);
          showSuccessMessage('Passbook entry updated successfully!');
        } else {
          await createPassbookEntry(selectedCustomer.id, passbookFormData);
          showSuccessMessage('Passbook entry created successfully!');
        }
        // Refresh passbook entries after creation/update
        await fetchPassbookEntries(selectedCustomer.id);
        resetPassbookForm();
        setEditingPassbookEntry(null);
        setShowPassbookForm(false);
      } catch (error) {
        handleApiError(error, 'Failed to save passbook entry');
      } finally {
        setIsPassbookSubmitting(false);
      }
    }
  };

  const handleDeletePassbookEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this passbook entry?')) {
      setIsPassbookDeleting(true);
      try {
        await deletePassbookEntry(entryId);
        showSuccessMessage('Passbook entry deleted successfully!');
        // Refresh passbook entries after deletion
        if (selectedCustomer) {
          await fetchPassbookEntries(selectedCustomer.id);
        }
      } catch (error) {
        handleApiError(error, 'Failed to delete passbook entry');
      } finally {
        setIsPassbookDeleting(false);
      }
    }
  };

  const handleEditPassbookEntry = (entry) => {
    setEditingPassbookEntry(entry);
      setPassbookFormData({
      month: entry.month.toString(),
      date: new Date(entry.date).toISOString().split('T')[0],
      dailyPayment: entry.dailyPayment.toString(),
      amount: entry.amount.toString(),
      chittiAmount: entry.chittiAmount.toString(),
      type: entry.type,
      paymentMethod: entry.paymentMethod || 'CASH',
      paymentFrequency: entry.paymentFrequency || 'DAILY',
      chitLifting: entry.chitLifting || 'NO'
    });
    setShowPassbookForm(true);
  };



  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') return 'bg-gray-100 text-gray-800';
    
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'DEFAULTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Customer
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Loading customers...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">Error: {error}</span>
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-auto">
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="DEFAULTED">Defaulted</option>
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={schemeFilter}
                onChange={(e) => setSchemeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Schemes</option>
                {chitSchemes.map((scheme) => (
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
      {showCreateForm && (
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {chitSchemes.map((scheme) => (
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
                  <option value="COMPLETED">Completed</option>
                  <option value="DEFAULTED">Defaulted</option>
                  </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <option value="MONTHS">Months</option>
                    <option value="DAYS">Days</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Photo</label>
                
                {/* Debug button for testing */}
                <button
                  type="button"
                  onClick={() => {
                    console.log('Current formData.photo:', formData.photo);
                    console.log('Type:', typeof formData.photo);
                    if (formData.photo) {
                      console.log('First 100 chars:', formData.photo.substring(0, 100));
                    }
                  }}
                  className="mb-2 px-2 py-1 text-xs bg-gray-200 rounded"
                >
                  Debug Photo Data
                </button>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.photo ? (
                      <div className="space-y-2">
                        <img
                          src={formData.photo}
                          alt="Member photo preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-600">Photo uploaded</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="photo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a photo</span>
                            <input
                              id="photo-upload"
                              name="photo"
                              type="file"
                              accept="image/*"
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Last Date */}
           

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCustomer(null);
                    resetForm();
                    setFormData({
                      name: '',
                      mobile: '',
                      address: '',
                      schemeId: '',
                      startDate: '',
                      lastDate: '',
                      amountPerDay: '',
                      duration: '',
                      durationType: 'MONTHS',
                      status: 'ACTIVE',
                      photo: ''
                    });
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingCustomer ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingCustomer ? 'Update Customer' : 'Add Customer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto">
        {/* Scheme Statistics */}
        {chitSchemes.map((scheme) => {
          const schemeCustomers = safeCustomers.filter(customer => customer.schemeId === scheme.id);
          const activeCustomers = schemeCustomers.filter(customer => customer.status === 'ACTIVE').length;
          const totalBalance = schemeCustomers.reduce((sum, customer) => sum + (customer.balance || 0), 0);
          
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
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chit Scheme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Date</th>
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
                    {customer.photo ? (
                      <img
                        src={customer.photo}
                        alt={`${customer.name} photo`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
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
                    ₹{((customer.amountPerDay || 0) * (customer.duration || 0) - (customer.balance || 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(customer.balance || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.lastDate ? new Date(customer.lastDate).toLocaleDateString('en-GB') : '-'}
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
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
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

      {/* Passbook Modal */}
      {showPassbookModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Passbook - {selectedCustomer.name}
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
                    <p className="font-medium">M{selectedCustomer.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedCustomer.mobile}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Chit Scheme:</span>
                    <p className="font-medium">{getSchemeName(selectedCustomer.schemeId)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Passbook Entry Button */}
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
                <div className="flex space-x-2">
                  
                <button
                  onClick={() => setShowPassbookForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add Manual Entry
                </button>
                </div>
              </div>

              {/* Passbook Loading and Error States */}
              {passbookLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-blue-800">Loading passbook entries...</span>
                  </div>
                </div>
              )}

              {passbookError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-800">Error: {passbookError}</span>
                    </div>
                    <button
                      onClick={clearPassbookError}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Add Passbook Entry Form Modal */}
              {showPassbookForm && (
                <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-60">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingPassbookEntry ? 'Edit Passbook Entry' : 'Add Passbook Entry'}
                    </h3>
                    <form onSubmit={handlePassbookSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                          <input
                            type="number"
                            name="month"
                            value={passbookFormData.month}
                            onChange={handlePassbookInputChange}
                            required
                            min="1"
                            max="12"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={passbookFormData.date}
                            onChange={handlePassbookInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {passbookFormData.paymentFrequency === 'MONTHLY' ? 'Monthly Payment (₹)' : 'Daily Payment (₹)'}
                          </label>
                          <input
                            type="number"
                            name="dailyPayment"
                            value={passbookFormData.dailyPayment}
                            onChange={handlePassbookInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                          <input
                            type="number"
                            name="amount"
                            value={passbookFormData.amount}
                            onChange={handlePassbookInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chitti Amount (₹)</label>
                          <input
                            type="number"
                            name="chittiAmount"
                            value={passbookFormData.chittiAmount}
                            onChange={handlePassbookInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                          <select
                            name="paymentMethod"
                            value={passbookFormData.paymentMethod}
                            onChange={handlePassbookInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="CHEQUE">Cheque</option>
                            <option value="NOT_PAID">Not Paid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Frequency</label>
                          <select
                            name="paymentFrequency"
                            value={passbookFormData.paymentFrequency}
                            onChange={handlePassbookInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="DAILY">Daily</option>
                            <option value="MONTHLY">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Chit Lifting</label>
                          <select
                            name="chitLifting"
                            value={passbookFormData.chitLifting}
                            onChange={handlePassbookInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="NO">No</option>
                            <option value="YES">Yes</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPassbookForm(false);
                            setEditingPassbookEntry(null);
                            resetPassbookForm();
                          }}
                          disabled={isPassbookSubmitting}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isPassbookSubmitting || passbookLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isPassbookSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {editingPassbookEntry ? 'Updating...' : 'Adding...'}
                            </>
                          ) : (
                            editingPassbookEntry ? 'Update Entry' : 'Add Entry'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Passbook Entries Table */}
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="max-h-80 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chitti Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chit Lifting</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {passbookEntries && passbookEntries.length > 0 ? (
                        passbookEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(entry.date).toLocaleDateString('en-GB')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="font-medium">₹{entry.dailyPayment.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">
                                  {entry.paymentFrequency === 'MONTHLY' ? 'Monthly' : 'Daily'} Payment
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{entry.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{entry.chittiAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                entry.paymentMethod === 'CASH' 
                                  ? 'bg-green-100 text-green-800' :
                                entry.paymentMethod === 'BANK_TRANSFER' 
                                  ? 'bg-blue-100 text-blue-800' :
                                entry.paymentMethod === 'UPI' 
                                  ? 'bg-purple-100 text-purple-800' :
                                entry.paymentMethod === 'CHEQUE' 
                                  ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                                {entry.paymentMethod?.replace('_', ' ') || 'CASH'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                entry.paymentFrequency === 'DAILY' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {entry.paymentFrequency || 'DAILY'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                entry.chitLifting === 'YES' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {entry.chitLifting || 'NO'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                entry.type === 'GENERATED' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {entry.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {entry.type === 'MANUAL' ? (
                                <div className="flex space-x-2">
                            <button
                                    onClick={() => handleEditPassbookEntry(entry)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Edit
                            </button>
                                  <button
                                    onClick={() => handleDeletePassbookEntry(entry.id)}
                                    disabled={isPassbookDeleting}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                  >
                                    {isPassbookDeleting ? (
                                      <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                        Deleting...
                                      </>
                                    ) : (
                                      'Delete'
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                            {passbookLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Loading entries...
                              </div>
                            ) : (
                              <div className="text-center">
                                <p className="text-gray-500 mb-2">No passbook entries found.</p>
                                <p className="text-sm text-gray-400">Click "Add Manual Entry" to create custom entries.</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>

              {/* Passbook Entries */}
             

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

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default CustomerManagement;

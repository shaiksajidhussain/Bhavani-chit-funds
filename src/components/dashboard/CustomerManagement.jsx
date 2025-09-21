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
    fetchChitSchemes,
    fetchCustomerSchemes
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
    setPassbookEntries,
    resetForm: resetPassbookForm,
    fetchPassbookEntries,
    createPassbookEntry,
    updatePassbookEntry,
    deletePassbookEntry,
    clearError: clearPassbookError,
    clearAll: clearAllPassbookData
  } = usePassbookStore();

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [editingPassbookEntry, setEditingPassbookEntry] = useState(null);
  
  // Passbook filter states
  const [passbookFrequencyFilter, setPassbookFrequencyFilter] = useState('all');
  const [passbookDateFrom, setPassbookDateFrom] = useState('');
  const [passbookDateTo, setPassbookDateTo] = useState('');
  
  // Passbook multi-scheme state
  const [selectedPassbookScheme, setSelectedPassbookScheme] = useState(null);
  const [customerSchemes, setCustomerSchemes] = useState([]);
  
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
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Full error object:', error);
    
    // Handle network errors
    if (!error.response) {
      console.log('No error.response found, showing network error');
      toast.error('Network error: Please check your internet connection', {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    if (error.response?.data) {
      const { success, message, errors, error: serverError } = error.response.data;
      
      // Handle validation errors - show each error message
      if (!success && errors && Array.isArray(errors) && errors.length > 0) {
        console.log('Processing validation errors:', errors);
        errors.forEach((errorItem, index) => {
          const fieldName = errorItem.path || 'Field';
          const errorMessage = errorItem.msg || 'Invalid value';
          
          // Show field-specific error with better formatting
          const displayMessage = fieldName === 'Field' ? errorMessage : `${fieldName}: ${errorMessage}`;
          
          console.log(`Showing validation error ${index}:`, displayMessage);
          
          toast.error(displayMessage, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: `validation-error-${index}`, // Prevent duplicate toasts
          });
        });
      } 
      // Handle server error messages
      else if (message) {
        toast.error(message, {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } 
      // Handle server error field
      else if (serverError) {
        toast.error(serverError, {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      // Handle HTTP status specific errors
      else {
        const status = error.response.status;
        let statusMessage = defaultMessage;
        
        switch (status) {
          case 400:
            statusMessage = 'Bad Request: Please check your input data';
            break;
          case 401:
            statusMessage = 'Unauthorized: Please login again';
            break;
          case 403:
            statusMessage = 'Forbidden: You do not have permission to perform this action';
            break;
          case 404:
            statusMessage = 'Not Found: The requested resource was not found';
            break;
          case 409:
            statusMessage = 'Conflict: This action conflicts with existing data';
            break;
          case 422:
            statusMessage = 'Validation Error: Please check your input data';
            break;
          case 500:
            statusMessage = 'Server Error: Please try again later';
            break;
          default:
            statusMessage = `Error ${status}: ${defaultMessage}`;
        }
        
        toast.error(statusMessage, {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } 
    // Handle error message from error object
    else if (error.message) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } 
    // Fallback to default message
    else {
      toast.error(defaultMessage, {
        position: "top-right",
        autoClose: 6000,
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
        
        // Check file size (1MB = 1024 * 1024 bytes)
        const maxSize = 1024 * 1024; // 1MB in bytes
        if (file.size > maxSize) {
          toast.error('File size must be less than 1MB. Please choose a smaller image.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          // Clear the file input
          e.target.value = '';
          return;
        }
        
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
          toast.error('Error processing image. Please try again.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } else if (name === 'durationType') {
      // Handle duration type change with amount conversion
      const currentAmount = parseFloat(formData.amountPerDay) || 0;
      let convertedAmount = currentAmount;
      
      if (currentAmount > 0) {
        if (value === 'MONTHS' && formData.durationType === 'DAYS') {
          // Convert daily to monthly (assuming 30 days per month)
          convertedAmount = Math.round(currentAmount * 30);
        } else if (value === 'DAYS' && formData.durationType === 'MONTHS') {
          // Convert monthly to daily (assuming 30 days per month)
          convertedAmount = Math.round(currentAmount / 30);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        amountPerDay: convertedAmount > 0 ? convertedAmount.toString() : prev.amountPerDay
      }));
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
        
        // If the deleted customer is currently being viewed in passbook, close the modal and clear all state
        if (selectedCustomer && selectedCustomer.id === id) {
          setShowPassbookModal(false);
          setSelectedCustomer(null);
          setCustomerSchemes([]);
          setSelectedPassbookScheme(null);
          setEditingPassbookEntry(null);
          setPassbookFrequencyFilter('all');
          setPassbookDateFrom('');
          setPassbookDateTo('');
          // Clear all passbook store state
          clearAllPassbookData();
        }
        
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
    
    try {
      // Fetch real schemes for this customer from the API
      const schemes = await fetchCustomerSchemes(customer.id);
      
      if (schemes && schemes.length > 0) {
        setCustomerSchemes(schemes);
        setSelectedPassbookScheme(schemes[0]);
        
        // Set initial chitti amount from selected scheme
        setPassbookFormData(prev => ({
          ...prev,
          chittiAmount: (schemes[0].chitValue || 0).toString()
        }));
        
        // Fetch passbook entries for the selected scheme
        await fetchPassbookEntries(customer.id, schemes[0].id);
      } else {
        // If no schemes found, show a message
        setCustomerSchemes([]);
        setSelectedPassbookScheme(null);
        setPassbookEntries([]);
        
        toast.info('No schemes found for this customer', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      handleApiError(error, 'Failed to load customer schemes');
    }
  };


  const handlePassbookSchemeChange = async (schemeId) => {
    const selectedScheme = customerSchemes.find(scheme => scheme.id === schemeId);
    if (selectedScheme) {
      setSelectedPassbookScheme(selectedScheme);
      
      // Update chitti amount in form based on selected scheme
      setPassbookFormData(prev => ({
        ...prev,
        chittiAmount: (selectedScheme.chitValue || 0).toString()
      }));
      
      // Fetch real passbook entries for the selected scheme
      try {
        // Clear existing entries first
        setPassbookEntries([]);
        // Fetch passbook entries for the real scheme
        await fetchPassbookEntries(selectedCustomer.id, schemeId);
      } catch (error) {
        handleApiError(error, 'Failed to load passbook entries for selected scheme');
      }
    }
  };

  // Filter passbook entries based on selected filters
  const getFilteredPassbookEntries = () => {
    if (!passbookEntries || passbookEntries.length === 0) return [];
    
    return passbookEntries.filter(entry => {
      // Filter by frequency
      if (passbookFrequencyFilter !== 'all' && entry.paymentFrequency !== passbookFrequencyFilter) {
        return false;
      }
      
      // Filter by date range
      if (passbookDateFrom || passbookDateTo) {
        const entryDate = new Date(entry.date);
        const fromDate = passbookDateFrom ? new Date(passbookDateFrom) : null;
        const toDate = passbookDateTo ? new Date(passbookDateTo) : null;
        
        if (fromDate && entryDate < fromDate) {
          return false;
        }
        if (toDate && entryDate > toDate) {
          return false;
        }
      }
      
      return true;
    });
  };

  const handlePassbookInputChange = (e) => {
    const { name, value } = e.target;
    
    // Skip chittiAmount updates as it's read-only and auto-managed
    if (name === 'chittiAmount') {
      return;
    }
    
    // If chitLifting is changed to NO, clear the chitLiftingAmount
    if (name === 'chitLifting' && value === 'NO') {
      setPassbookFormData({
        ...passbookFormData,
        [name]: value,
        chitLiftingAmount: '' // Clear the amount when chit lifting is NO
      });
    } else {
      setPassbookFormData({
        ...passbookFormData,
        [name]: value
      });
    }
  };

  const handlePassbookSubmit = async (e) => {
    e.preventDefault();
    if (selectedCustomer) {
      setIsPassbookSubmitting(true);
      try {
        // Include the selected scheme in the form data
        const entryData = {
          ...passbookFormData,
          schemeId: selectedPassbookScheme?.id || selectedCustomer.schemeId,
          amount: passbookFormData.amount || passbookFormData.dailyPayment // Ensure amount is set
        };
        
        if (editingPassbookEntry) {
          await updatePassbookEntry(selectedCustomer.id, entryData);
          showSuccessMessage('Passbook entry updated successfully!');
        } else {
          await createPassbookEntry(selectedCustomer.id, entryData);
          showSuccessMessage('Passbook entry created successfully!');
        }
        // Refresh passbook entries for the selected scheme after creation/update
        const currentSchemeId = selectedPassbookScheme?.id || selectedCustomer.schemeId;
        await fetchPassbookEntries(selectedCustomer.id, currentSchemeId);
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
      chittiAmount: (selectedPassbookScheme?.chitValue || 0).toString(), // Use selected scheme's chitValue instead of entry's value
      chitLiftingAmount: entry.chitLiftingAmount ? entry.chitLiftingAmount.toString() : '',
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
    <div className="space-y-4 lg:space-y-6 px-2 sm:px-4 py-4 lg:py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
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
            <div>
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
            <div className="sm:col-span-2 lg:col-span-1">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSchemeFilter('all');
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.durationType === 'MONTHS' ? 'Amount per Month' : 'Amount per Day'}
                  </label>
                  <input
                    type="number"
                    name="amountPerDay"
                    value={formData.amountPerDay}
                    onChange={handleInputChange}
                    required
                    placeholder={formData.durationType === 'MONTHS' ? 'Enter monthly amount' : 'Enter daily amount'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.durationType === 'MONTHS' 
                      ? 'Amount will be automatically converted when switching to daily' 
                      : 'Amount will be automatically converted when switching to monthly'}
                  </p>
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
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto">
        {/* Scheme Statistics */}
        {chitSchemes.map((scheme) => {
          const schemeCustomers = safeCustomers.filter(customer => customer.schemeId === scheme.id);
          const activeCustomers = schemeCustomers.filter(customer => customer.status === 'ACTIVE').length;
          const totalBalance = schemeCustomers.reduce((sum, customer) => sum + (customer.balance || 0), 0);
          
          return (
            <div key={scheme.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">{scheme.name}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{schemeCustomers.length}</p>
                  <p className="text-sm text-gray-500">{activeCustomers} active</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-600">Total Balance</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">₹{totalBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Members</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Photo</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Scheme</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Paid</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Due</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Next Due</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {customer.photo ? (
                      <img
                        src={customer.photo}
                        alt={`${customer.name} photo`}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    M{customer.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewPassbook(customer)}
                        className="text-blue-600 hover:text-blue-900 hover:underline cursor-pointer truncate"
                      >
                        {customer.name}
                      </button>
                      {/* Mobile: Show photo next to name */}
                      <div className="sm:hidden">
                        {customer.photo ? (
                          <img
                            src={customer.photo}
                            alt={`${customer.name} photo`}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-medium">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {customer.mobile}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <span className="truncate block max-w-24">{getSchemeName(customer.schemeId)}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    ₹{((customer.amountPerDay || 0) * (customer.duration || 0) - (customer.balance || 0)).toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    ₹{(customer.balance || 0).toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    {customer.lastDate ? new Date(customer.lastDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-xs sm:text-sm"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                            <span className="hidden sm:inline">Deleting...</span>
                            <span className="sm:hidden">...</span>
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
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Passbook - {selectedCustomer.name}
                </h2>
                <button
                  onClick={() => {
                    setShowPassbookModal(false);
                    setSelectedCustomer(null);
                    setCustomerSchemes([]);
                    setSelectedPassbookScheme(null);
                    setEditingPassbookEntry(null);
                    setPassbookFrequencyFilter('all');
                    setPassbookDateFrom('');
                    setPassbookDateTo('');
                    clearAllPassbookData();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Customer Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Customer ID:</span>
                    <p className="font-medium">M{selectedCustomer.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedCustomer.mobile}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      Chit Scheme:
                      {customerSchemes.length > 1 && (
                        <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {customerSchemes.length} schemes
                        </span>
                      )}
                    </span>
                    {customerSchemes.length > 1 ? (
                      <select
                        value={selectedPassbookScheme?.id || ''}
                        onChange={(e) => handlePassbookSchemeChange(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        {customerSchemes.map((scheme) => (
                          <option key={scheme.id} value={scheme.id}>
                            {scheme.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="font-medium">{selectedPassbookScheme?.name || getSchemeName(selectedCustomer.schemeId)}</p>
                    )}
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
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
                    {/* {customerSchemes.length > 1 && selectedPassbookScheme && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Currently viewing:</span> {selectedPassbookScheme.name}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Switch schemes using the dropdown above to see different data
                        </p>
                      </div>
                    )} */}
                    {customerSchemes.length === 0 && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">No schemes found</span> for this customer
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          This customer is not enrolled in any chit schemes yet
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    
                  <button
                    onClick={() => {
                      // Reset form and pre-fill with selected scheme data
                      if (selectedPassbookScheme) {
                        setPassbookFormData({
                          month: '',
                          date: new Date().toISOString().split('T')[0],
                          dailyPayment: '',
                          amount: '',
                          chittiAmount: (selectedPassbookScheme.chitValue || 0).toString(),
                          chitLiftingAmount: '',
                          type: 'MANUAL',
                          paymentMethod: 'CASH',
                          paymentFrequency: 'DAILY',
                          chitLifting: 'NO'
                        });
                      } else {
                        resetPassbookForm();
                      }
                      setShowPassbookForm(true);
                    }}
                    disabled={customerSchemes.length === 0}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      customerSchemes.length === 0
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    + Add Manual Entry
                  </button>
                  </div>
                </div>
                
                {/* Chit Lifting Description */}
                {passbookEntries && passbookEntries.length > 0 && (() => {
                  const chitLiftingEntries = passbookEntries.filter(entry => entry.chitLifting === 'YES');
                  if (chitLiftingEntries.length > 0) {
                    return (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">
                              {chitLiftingEntries.length === 1 ? 'Chit Lifted Successfully' : `Chit Lifted ${chitLiftingEntries.length} Times`}
                            </p>
                            <div className="text-xs text-green-600 mt-1">
                              {chitLiftingEntries.map((entry, index) => (
                                <div key={entry.id} className="mb-1">
                                  {index > 0 && <span className="text-green-400">• </span>}
                                  Month {entry.month}, {new Date(entry.date).toLocaleDateString('en-GB')} - ₹{entry.amount?.toLocaleString() || entry.chittiAmount?.toLocaleString()}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
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
                <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-60 p-4">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingPassbookEntry ? 'Edit Passbook Entry' : 'Add Passbook Entry'}
                    </h3>
                    
                    {/* Scheme Indicator */}
                    {selectedPassbookScheme && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              <span className="font-semibold">Selected Scheme:</span> {selectedPassbookScheme.name}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              This entry will be associated with the currently selected scheme
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-800">
                              <span className="font-semibold">Chit Value:</span> ₹{(selectedPassbookScheme.chitValue || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Pre-filled in Chitti Amount field
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handlePassbookSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* <div>
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
                        </div> */}
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chitti Amount (₹)
                            {selectedPassbookScheme && (
                              <span className="ml-2 text-xs text-blue-600 font-normal">
                                (from {selectedPassbookScheme.name})
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            name="chittiAmount"
                            value={passbookFormData.chittiAmount || ''}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                            placeholder="Auto-filled from selected scheme"
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

                        {/* Chit Lifting Amount - Only show when Chit Lifting is YES */}
                        {passbookFormData.chitLifting === 'YES' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chit Lifting Amount (₹)</label>
                            <input
                              type="number"
                              name="chitLiftingAmount"
                              value={passbookFormData.chitLiftingAmount || ''}
                              onChange={handlePassbookInputChange}
                              min="0"
                              step="0.01"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter chit lifting amount"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Enter the amount received when the chit was lifted
                            </p>
                          </div>
                        )}
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
                    
                    {/* Passbook Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Frequency Filter */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Frequency:</label>
                        <select
                          value={passbookFrequencyFilter}
                          onChange={(e) => setPassbookFrequencyFilter(e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All</option>
                          <option value="DAILY">Daily</option>
                          <option value="MONTHLY">Monthly</option>
                        </select>
                      </div>
                      
                      {/* Date Range Filters */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">From:</label>
                        <input
                          type="date"
                          value={passbookDateFrom}
                          onChange={(e) => setPassbookDateFrom(e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">To:</label>
                        <input
                          type="date"
                          value={passbookDateTo}
                          onChange={(e) => setPassbookDateTo(e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      {/* Clear Filters Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPassbookFrequencyFilter('all');
                          setPassbookDateFrom('');
                          setPassbookDateTo('');
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  {/* Filter Summary */}
                  {(() => {
                    const filteredEntries = getFilteredPassbookEntries();
                    const totalEntries = passbookEntries ? passbookEntries.length : 0;
                    const hasActiveFilters = passbookFrequencyFilter !== 'all' || passbookDateFrom || passbookDateTo;
                    
                    if (hasActiveFilters && totalEntries > 0) {
                      return (
                        <div className="px-6 py-2 bg-blue-50 border-t border-blue-200">
                          <p className="text-sm text-blue-800">
                            Showing {filteredEntries.length} of {totalEntries} entries
                            {passbookFrequencyFilter !== 'all' && ` (filtered by ${passbookFrequencyFilter.toLowerCase()} frequency)`}
                            {(passbookDateFrom || passbookDateTo) && ' (filtered by date range)'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="overflow-x-auto">
                  <div className="max-h-44 sm:max-h-44 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                      {(() => {
                        const filteredEntries = getFilteredPassbookEntries();
                        return filteredEntries && filteredEntries.length > 0 ? (
                          filteredEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
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
                                <p className="text-gray-500 mb-2">
                                  {getFilteredPassbookEntries().length === 0 && (passbookEntries && passbookEntries.length > 0)
                                    ? 'No entries match the selected filters.'
                                    : 'No passbook entries found.'
                                  }
                                </p>
                                <p className="text-sm text-gray-400">
                                  {getFilteredPassbookEntries().length === 0 && (passbookEntries && passbookEntries.length > 0)
                                    ? 'Try adjusting your filters or click "Clear" to see all entries.'
                                    : 'Click "Add Manual Entry" to create custom entries.'
                                  }
                                </p>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                      })()}
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

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    schemeMembers,
    membersLoading,
    membersError,
    membersStats,
    fetchSchemes,
    createScheme,
    updateScheme,
    deleteScheme,
    setShowCreateForm,
    setEditingScheme,
    setShowMembersModal,
    setSelectedScheme,
    fetchSchemeMembers,
    resetForm
  } = useChitSchemeStore();

  const [formData, setFormData] = useState({
    name: '',
    chitValue: '',
    duration: '',
    durationType: 'months',
    paymentType: 'DAILY',
    dailyPayment: '',
    monthlyPayment: '',
    numberOfMembers: '',
    auctionRules: '',
    status: 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0],
    lastDate: ''
  });

  // Local loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch schemes on component mount
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        await fetchSchemes();
      } catch (error) {
        handleApiError(error, 'Failed to load chit schemes');
      }
    };
    loadSchemes();
  }, [fetchSchemes]);

  // Ensure schemes is always an array
  const safeSchemes = Array.isArray(schemes) ? schemes : [];

  // Helper function to handle API errors and show toast notifications
  const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // Handle network errors
    if (!error.response) {
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
        errors.forEach((errorItem, index) => {
          const fieldName = errorItem.path || 'Field';
          const errorMessage = errorItem.msg || 'Invalid value';
          
          // Show field-specific error with better formatting
          const displayMessage = fieldName === 'Field' ? errorMessage : `${fieldName}: ${errorMessage}`;
          
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const schemeData = {
        ...formData,
        chitValue: parseInt(formData.chitValue),
        duration: parseInt(formData.duration),
        durationType: formData.durationType.toUpperCase(), // Convert to uppercase
        paymentType: formData.paymentType.toUpperCase(), // Convert to uppercase
        dailyPayment: formData.paymentType === 'DAILY' ? parseInt(formData.dailyPayment) : null,
        monthlyPayment: formData.paymentType === 'MONTHLY' ? parseInt(formData.monthlyPayment) : null,
        numberOfMembers: parseInt(formData.numberOfMembers),
        startDate: formData.startDate,
        lastDate: formData.lastDate || null,
        status: formData.status
      };

      if (editingScheme) {
        await updateScheme(editingScheme.id, schemeData);
        showSuccessMessage('Chit scheme updated successfully!');
        // Refresh the schemes list after update
        await fetchSchemes();
      } else {
        await createScheme(schemeData);
        showSuccessMessage('Chit scheme created successfully!');
        // Refresh the schemes list after creation
        await fetchSchemes();
      }
      
      resetForm();
      setFormData({
        name: '',
        chitValue: '',
        duration: '',
        durationType: 'months',
        paymentType: 'DAILY',
        dailyPayment: '',
        monthlyPayment: '',
        numberOfMembers: '',
        auctionRules: '',
        status: 'ACTIVE',
        startDate: new Date().toISOString().split('T')[0],
        lastDate: ''
      });
    } catch (error) {
      handleApiError(error, 'Failed to save chit scheme');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleEdit = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name,
      chitValue: scheme.chitValue.toString(),
      duration: scheme.duration.toString(),
      durationType: scheme.durationType ? scheme.durationType.toLowerCase() : 'months',
      paymentType: scheme.paymentType || 'DAILY',
      dailyPayment: scheme.dailyPayment ? scheme.dailyPayment.toString() : '',
      monthlyPayment: scheme.monthlyPayment ? scheme.monthlyPayment.toString() : '',
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
      setIsDeleting(true);
      try {
        await deleteScheme(id);
        showSuccessMessage('Chit scheme deleted successfully!');
        // Refresh the schemes list after deletion
        await fetchSchemes();
      } catch (error) {
        handleApiError(error, 'Failed to delete chit scheme');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleViewMembers = async (scheme) => {
    setSelectedScheme(scheme);
    setShowMembersModal(true);
    
    // Fetch members for this scheme
    try {
      await fetchSchemeMembers(scheme.id);
    } catch (error) {
      handleApiError(error, 'Failed to load scheme members');
    }
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
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chit Scheme Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Predefined Schemes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DAILY">Daily Payment</option>
                  <option value="MONTHLY">Monthly Payment</option>
                </select>
              </div>

              {formData.paymentType === 'DAILY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Payment (₹)</label>
                  <input
                    type="number"
                    name="dailyPayment"
                    value={formData.dailyPayment}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter daily payment amount"
                  />
                </div>
              )}

              {formData.paymentType === 'MONTHLY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment (₹)</label>
                  <input
                    type="number"
                    name="monthlyPayment"
                    value={formData.monthlyPayment}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter monthly payment amount"
                  />
                </div>
              )}

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
                      paymentType: 'DAILY',
                      dailyPayment: '',
                      monthlyPayment: '',
                      numberOfMembers: '',
                      auctionRules: '',
                      status: 'ACTIVE',
                      startDate: new Date().toISOString().split('T')[0],
                      lastDate: ''
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
                      {editingScheme ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingScheme ? 'Update Scheme' : 'Create Scheme'
                  )}
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
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Value</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Duration</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Payment Type</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Payment Amount</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Last Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Progress</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeSchemes.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                    {loading ? 'Loading schemes...' : 'No chit schemes found. Create your first scheme!'}
                  </td>
                </tr>
              ) : (
                safeSchemes.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <button
                        onClick={() => handleViewMembers(scheme)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline cursor-pointer truncate block"
                      >
                        {scheme.name}
                      </button>
                      <div className="text-xs text-gray-500">ID: {scheme.id}</div>
                      {/* Mobile: Show key info below name */}
                      <div className="sm:hidden mt-1 text-xs text-gray-600">
                        <div>₹{(scheme.chitValue || 0).toLocaleString()}</div>
                        <div>{scheme.duration || 0} {scheme.durationType ? scheme.durationType.toLowerCase() : 'months'}</div>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(scheme.status)}`}>
                            {scheme.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    ₹{(scheme.chitValue || 0).toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {scheme.duration || 0} {scheme.durationType ? scheme.durationType.toLowerCase() : 'months'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      scheme.paymentType === 'DAILY' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {scheme.paymentType || 'DAILY'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    {scheme.paymentType === 'MONTHLY' 
                      ? `₹${(scheme.monthlyPayment || 0).toLocaleString()}` 
                      : `₹${(scheme.dailyPayment || 0).toLocaleString()}`
                    }
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    {scheme.lastDate ? new Date(scheme.lastDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-center">
                      <div className="font-medium">{scheme.membersEnrolled || 0}/{scheme.numberOfMembers || 0}</div>
                      {/* Mobile: Show progress bar below members count */}
                      <div className="sm:hidden mt-1">
                        <div className="flex items-center justify-center">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-1">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${getProgressPercentage(scheme.membersEnrolled, scheme.numberOfMembers)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {getProgressPercentage(scheme.membersEnrolled, scheme.numberOfMembers)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
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
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(scheme.status)}`}>
                      {scheme.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleEdit(scheme)}
                        className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(scheme.id)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Members Modal */}
      {showMembersModal && selectedScheme && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                
                {/* Loading State */}
                {membersLoading && (
                  <div className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-gray-600">Loading members...</span>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {membersError && (
                  <div className="px-6 py-4 bg-red-50 border border-red-200 rounded-lg m-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-800">Error: {membersError}</span>
                    </div>
                  </div>
                )}

                {/* Members Table */}
                {!membersLoading && !membersError && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Mobile</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Group</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Join Date</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Amount Paid</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Balance</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {schemeMembers && schemeMembers.length > 0 ? (
                          schemeMembers.map((member, index) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                M{member.id.toString().padStart(4, '0')}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <div>
                                  <div className="truncate">{member.name}</div>
                                  {/* Mobile: Show mobile number below name */}
                                  <div className="sm:hidden text-xs text-gray-500 mt-1">
                                    {member.mobile}
                                  </div>
                                  {/* Mobile: Show key financial info below name */}
                                  <div className="sm:hidden text-xs text-gray-600 mt-1">
                                    <div>Paid: ₹{((member.amountPerDay || 0) * (member.duration || 0) - (member.balance || 0)).toLocaleString()}</div>
                                    <div>Balance: ₹{(member.balance || 0).toLocaleString()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                                {member.mobile}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                                {member.group}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                                {member.startDate ? new Date(member.startDate).toLocaleDateString('en-GB') : '-'}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                                ₹{((member.amountPerDay || 0) * (member.duration || 0) - (member.balance || 0)).toLocaleString()}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                                ₹{(member.balance || 0).toLocaleString()}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                                  {member.status || 'Unknown'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500">
                              No members enrolled in this scheme yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary Statistics */}
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Total Members</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {membersStats ? membersStats.totalMembers : '-'}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Active Members</div>
                  <div className="text-2xl font-bold text-green-900">
                    {membersStats ? membersStats.activeMembers : '-'}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Completed</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {membersStats ? membersStats.completedMembers : '-'}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600">Defaulted</div>
                  <div className="text-2xl font-bold text-red-900">
                    {membersStats ? membersStats.defaultedMembers : '-'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
                  Export Members List
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto">
                  Add New Member
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

export default ChitSchemeManagement;

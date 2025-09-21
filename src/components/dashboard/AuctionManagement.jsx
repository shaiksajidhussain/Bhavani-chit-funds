import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    fetchSchemeMembers,
    createAuction,
    updateAuction,
    deleteAuction
  } = useAuctionStore();

  const [selectedScheme, setSelectedScheme] = useState('all');
  
  // Local loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAuctions();
        await fetchChitSchemes();
        await fetchMembers();
      } catch (error) {
        handleApiError(error, 'Failed to load auction data');
      }
    };
    loadData();
  }, [fetchAuctions, fetchChitSchemes, fetchMembers]);

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

  const handleInputChange = async (e) => {
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
        chitValue: selectedScheme?.chitValue || '',
        winningMemberId: '', // Clear winning member when scheme changes
        memberId: '' // Clear member ID when scheme changes
      };
      console.log('Updated form data:', newData);
      setFormData(newData);
      
      // Fetch members for the selected scheme
      if (value) {
        try {
          await fetchSchemeMembers(value);
        } catch (error) {
          console.error('Error fetching scheme members:', error);
          handleApiError(error, 'Failed to load scheme members');
        }
      } else {
        // If no scheme selected, clear members by fetching all members
        try {
          await fetchMembers();
        } catch (error) {
          console.error('Error fetching all members:', error);
        }
      }
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
    setIsSubmitting(true);
    
    // Get the current form data from the store
    const currentFormData = useAuctionStore.getState().formData;
    console.log('Form data before submission:', currentFormData);
    console.log('Form data keys:', Object.keys(currentFormData));
    console.log('Form data values:', Object.values(currentFormData));
    console.log('Chit schemes available:', chitSchemes);
    console.log('Members available:', members);
    
    // Check if form data is empty
    if (!currentFormData.chitSchemeId) {
      toast.error('Please select a chit scheme', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSubmitting(false);
      return;
    }
    if (!currentFormData.auctionDate) {
      toast.error('Please select an auction date', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSubmitting(false);
      return;
    }
    if (!currentFormData.winningMemberId) {
      toast.error('Please select a winning member', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      if (editingAuction) {
        await updateAuction(editingAuction.id, currentFormData);
        showSuccessMessage('Auction updated successfully!');
        setEditingAuction(null);
        // Refresh the auctions list after update
        await fetchAuctions();
      } else {
        await createAuction(currentFormData);
        showSuccessMessage('Auction created successfully!');
        // Refresh the auctions list after creation
        await fetchAuctions();
      }
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      handleApiError(error, 'Failed to save auction');
    } finally {
      setIsSubmitting(false);
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
      setIsDeleting(true);
      try {
        await deleteAuction(id);
        showSuccessMessage('Auction deleted successfully!');
        // Refresh the auctions list after deletion
        await fetchAuctions();
      } catch (error) {
        handleApiError(error, 'Failed to delete auction');
      } finally {
        setIsDeleting(false);
      }
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
    <div className="space-y-4 lg:space-y-6 px-2 sm:px-4 py-4 lg:py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Auction & Lifting Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          + Add New Auction
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {Object.entries(schemeStats).map(([scheme, stats]) => (
          <div key={scheme} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 truncate">{scheme}</h3>
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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Scheme:</label>
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {editingAuction ? 'Edit Lifting' : 'Add New Lifting'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chit Date</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chit Number</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Winning Member</label>
                  <select
                    name="winningMemberId"
                    value={formData.winningMemberId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.chitSchemeId}
                  >
                    <option value="">
                      {!formData.chitSchemeId 
                        ? "Select a scheme first" 
                        : members.length === 0 
                          ? "No members in this scheme" 
                          : "Select Member"
                      }
                    </option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} (ID: {member.id})
                      </option>
                    ))}
                  </select>
                  {formData.chitSchemeId && members.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      No members are enrolled in this scheme yet.
                    </p>
                  )}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div> */}
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div> */}

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
                      {editingAuction ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingAuction ? 'Update' : 'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auction History Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Auction History</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>  
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Auction Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Chit Number</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winning Member</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Amount Received</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-3 sm:px-6 py-4 text-center text-gray-500">
                    Loading auctions...
                  </td>
                </tr>
              ) : filteredAuctions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 sm:px-6 py-4 text-center text-gray-500">
                    No auctions found
                  </td>
                </tr>
              ) : (
                filteredAuctions.map((auction) => (
                  <tr key={auction.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate">{auction.chitScheme?.name || 'Unknown Scheme'}</div>
                        <div className="text-xs text-gray-500">Value: ₹{auction.chitScheme?.chitValue?.toLocaleString() || 'N/A'}</div>
                        {/* Mobile: Show additional info below scheme name */}
                        <div className="sm:hidden mt-1 text-xs text-gray-600">
                          <div>Date: {auction.auctionDate ? new Date(auction.auctionDate).toLocaleDateString() : 'N/A'}</div>
                          <div>Chit #: {auction.newDailyPayment || 'N/A'}</div>
                          <div>Amount: ₹{(auction.amountReceived || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      {auction.auctionDate ? new Date(auction.auctionDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {auction.newDailyPayment || 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate">{auction.winningMember?.name || 'No Member'}</div>
                        <div className="text-xs text-gray-500">ID: {auction.winningMember?.id || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      ₹{(auction.amountReceived || 0).toLocaleString()}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(auction.discountAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(auction.newDailyPayment || 0).toLocaleString()}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </td> */}
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleEdit(auction)}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(auction.id)}
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
      </div>

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

export default AuctionManagement;

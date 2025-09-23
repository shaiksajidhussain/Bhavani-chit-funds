import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCustomerStore from '../../stores/customerStore';
import usePassbookStore from '../../stores/passbookStore';
import apiConfig from '../../components/Config';

const AdminDashboard = ({ onNavigate }) => {
  // Customer store
  const {
    customers,
    chitSchemes,
    loading: customersLoading,
    selectedCustomer,
    showPassbookModal,
    setShowPassbookModal,
    setSelectedCustomer,
    fetchCustomers,
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

  // Dashboard state
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    recentActivities: [],
    dailyStats: null,
    passbookStats: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchRef, setSearchRef] = useState(null);
  const [editingPassbookEntry, setEditingPassbookEntry] = useState(null);
  const [isPassbookSubmitting, setIsPassbookSubmitting] = useState(false);
  const [isPassbookDeleting, setIsPassbookDeleting] = useState(false);
  
  // Passbook multi-scheme state
  const [selectedPassbookScheme, setSelectedPassbookScheme] = useState(null);
  const [customerSchemes, setCustomerSchemes] = useState([]);
  
  // Passbook filter states
  const [passbookFrequencyFilter, setPassbookFrequencyFilter] = useState('all');
  const [passbookDateFrom, setPassbookDateFrom] = useState('');
  const [passbookDateTo, setPassbookDateTo] = useState('');
  
  // Print and PDF states
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // API functions
  const fetchDashboardOverview = async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/reports/dashboard/overview`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard overview');
      const data = await response.json();
      return data.success ? data.data.overview : null;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      return null;
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/reports/recent-activities?limit=8`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch recent activities');
      const data = await response.json();
      return data.success ? data.data.activities : [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  };

  const fetchDailyStats = async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/reports/daily`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch daily stats');
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      return null;
    }
  };

  const fetchPassbookStats = async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/reports/passbook-stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch passbook stats');
      const data = await response.json();
      return data.success ? data.data.stats : null;
    } catch (error) {
      console.error('Error fetching passbook stats:', error);
      return null;
    }
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [overview, recentActivities, dailyStats, passbookStats] = await Promise.all([
          fetchDashboardOverview(),
          fetchRecentActivities(),
          fetchDailyStats(),
          fetchPassbookStats()
        ]);

        setDashboardData({
          overview,
          recentActivities,
          dailyStats,
          passbookStats
        });

        // Also fetch customers and schemes for search functionality
        await Promise.all([
          fetchCustomers(),
          fetchChitSchemes()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchCustomers, fetchChitSchemes]);

  // Click outside handler to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef && !searchRef.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  // Search functionality
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length >= 2) {
      const results = customers.filter(customer => 
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.mobile.includes(term)
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle member click - open passbook
  const handleMemberClick = async (customer) => {
    setSelectedCustomer(customer);
    setShowPassbookModal(true);
    setShowSearchResults(false);
    setSearchTerm('');
    
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

  // Handle passbook scheme change
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

  // Print passbook functionality
  const handlePrintPassbook = () => {
    setIsPrinting(true);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const filteredEntries = getFilteredPassbookEntries();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Passbook - ${selectedCustomer.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .customer-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .info-item { margin: 5px 0; }
            .info-label { font-weight: bold; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .amount { text-align: right; }
            .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .status-yes { background-color: #d4edda; color: #155724; }
            .status-no { background-color: #f8d7da; color: #721c24; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bhavani Chit Funds</h1>
            <h2>Passbook - ${selectedCustomer.name}</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="customer-info">
            <div>
              <div class="info-item"><span class="info-label">Customer ID:</span> M${selectedCustomer.id.toString().padStart(4, '0')}</div>
              <div class="info-item"><span class="info-label">Phone:</span> ${selectedCustomer.mobile}</div>
              <div class="info-item"><span class="info-label">Status:</span> ${selectedCustomer.status}</div>
            </div>
            <div>
              <div class="info-item"><span class="info-label">Scheme:</span> ${selectedPassbookScheme?.name || 'N/A'}</div>
              <div class="info-item"><span class="info-label">Chit Value:</span> ₹${(selectedPassbookScheme?.chitValue || 0).toLocaleString()}</div>
              <div class="info-item"><span class="info-label">Total Entries:</span> ${filteredEntries.length}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Chitti Amount</th>
                <th>Payment Method</th>
                <th>Frequency</th>
                <th>Chit Lifting</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEntries.map(entry => `
                <tr>
                  <td>${new Date(entry.date).toLocaleDateString('en-GB')}</td>
                  <td class="amount">₹${entry.dailyPayment.toLocaleString()}</td>
                  <td class="amount">₹${entry.amount.toLocaleString()}</td>
                  <td class="amount">₹${entry.chittiAmount.toLocaleString()}</td>
                  <td>${entry.paymentMethod?.replace('_', ' ') || 'CASH'}</td>
                  <td>${entry.paymentFrequency || 'DAILY'}</td>
                  <td><span class="status ${entry.chitLifting === 'YES' ? 'status-yes' : 'status-no'}">${entry.chitLifting || 'NO'}</span></td>
                  <td>${entry.type}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is a computer generated passbook. No signature required.</p>
            <p>Bhavani Chit Funds - ${new Date().getFullYear()}</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    setIsPrinting(false);
    showSuccessMessage('Passbook sent to printer!');
  };

  // Export to PDF functionality
  const handleExportToPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const filteredEntries = getFilteredPassbookEntries();
      
      // Prepare data for PDF generation
      const pdfData = {
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          mobile: selectedCustomer.mobile,
          status: selectedCustomer.status
        },
        scheme: {
          name: selectedPassbookScheme?.name || 'N/A',
          chitValue: selectedPassbookScheme?.chitValue || 0
        },
        entries: filteredEntries.map(entry => ({
          date: new Date(entry.date).toLocaleDateString('en-GB'),
          dailyPayment: entry.dailyPayment,
          amount: entry.amount,
          chittiAmount: entry.chittiAmount,
          paymentMethod: entry.paymentMethod?.replace('_', ' ') || 'CASH',
          paymentFrequency: entry.paymentFrequency || 'DAILY',
          chitLifting: entry.chitLifting || 'NO',
          type: entry.type
        })),
        generatedOn: new Date().toLocaleString(),
        totalEntries: filteredEntries.length
      };
      
      // Call backend API to generate PDF
      const response = await fetch(`${apiConfig.baseUrl}/passbook/export-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pdfData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      // Check if response is actually a PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Response is not a PDF file');
      }
      
      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `passbook-${selectedCustomer.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      showSuccessMessage('PDF exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback: Generate PDF using browser's print to PDF
      const filteredEntries = getFilteredPassbookEntries();
      
      // Create a hidden iframe for PDF generation
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Passbook - ${selectedCustomer.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .customer-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .info-item { margin: 5px 0; }
              .info-label { font-weight: bold; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .amount { text-align: right; }
              .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
              .status-yes { background-color: #d4edda; color: #155724; }
              .status-no { background-color: #f8d7da; color: #721c24; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Bhavani Chit Funds</h1>
              <h2>Passbook - ${selectedCustomer.name}</h2>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="customer-info">
              <div>
                <div class="info-item"><span class="info-label">Customer ID:</span> M${selectedCustomer.id.toString().padStart(4, '0')}</div>
                <div class="info-item"><span class="info-label">Phone:</span> ${selectedCustomer.mobile}</div>
                <div class="info-item"><span class="info-label">Status:</span> ${selectedCustomer.status}</div>
              </div>
              <div>
                <div class="info-item"><span class="info-label">Scheme:</span> ${selectedPassbookScheme?.name || 'N/A'}</div>
                <div class="info-item"><span class="info-label">Chit Value:</span> ₹${(selectedPassbookScheme?.chitValue || 0).toLocaleString()}</div>
                <div class="info-item"><span class="info-label">Total Entries:</span> ${filteredEntries.length}</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Chitti Amount</th>
                  <th>Payment Method</th>
                  <th>Frequency</th>
                  <th>Chit Lifting</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                ${filteredEntries.map(entry => `
                  <tr>
                    <td>${new Date(entry.date).toLocaleDateString('en-GB')}</td>
                    <td class="amount">₹${entry.dailyPayment.toLocaleString()}</td>
                    <td class="amount">₹${entry.amount.toLocaleString()}</td>
                    <td class="amount">₹${entry.chittiAmount.toLocaleString()}</td>
                    <td>${entry.paymentMethod?.replace('_', ' ') || 'CASH'}</td>
                    <td>${entry.paymentFrequency || 'DAILY'}</td>
                    <td><span class="status ${entry.chitLifting === 'YES' ? 'status-yes' : 'status-no'}">${entry.chitLifting || 'NO'}</span></td>
                    <td>${entry.type}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>This is a computer generated passbook. No signature required.</p>
              <p>Bhavani Chit Funds - ${new Date().getFullYear()}</p>
            </div>
          </body>
        </html>
      `;
      
      iframe.contentDocument.write(printContent);
      iframe.contentDocument.close();
      
      // Wait for content to load, then trigger print
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.print();
          // Clean up iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 500);
      };
      
      // Show instructions for PDF generation
      showSuccessMessage('Print dialog opened - select "Save as PDF" to download');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Passbook form handlers
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
        if (selectedCustomer && selectedPassbookScheme) {
          await fetchPassbookEntries(selectedCustomer.id, selectedPassbookScheme.id);
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
      month: entry.month?.toString() || '',
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

  // Calculate overview data from API data
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const overview = dashboardData.overview;
  const passbookStats = dashboardData.passbookStats;
  
  // Use real passbook data for profit calculations
  const dailyProfits = passbookStats?.totals?.dailyProfits || 0;
  const monthlyProfits = passbookStats?.totals?.monthlyProfits || 0;
  const totalExpectedDailyCollection = passbookStats?.totals?.expectedDaily || 0;
  const totalActualDailyCollection = passbookStats?.totals?.actualDaily || 0;
  const totalExpectedMonthlyCollection = totalExpectedDailyCollection * (passbookStats?.totals?.daysInMonth || 30);
  const collectionRate = passbookStats?.totals?.collectionRate || 0;
  
  // Calculate profit percentages based on actual collections
  const dailyProfitPercentage = totalActualDailyCollection > 0 
    ? ((dailyProfits / totalActualDailyCollection) * 100).toFixed(2)
    : 0;
  
  const monthlyProfitPercentage = (totalActualDailyCollection * (passbookStats?.totals?.daysInMonth || 30)) > 0 
    ? ((monthlyProfits / (totalActualDailyCollection * (passbookStats?.totals?.daysInMonth || 30))) * 100).toFixed(2)
    : 0;
  
  // Use real API data when available, fallback to calculated data
  const overviewData = {
    totalCustomers: overview?.customers?.total || safeCustomers.length,
    activeChits: overview?.customers?.active || safeCustomers.filter(c => c.status === 'ACTIVE').length,
    totalSchemes: overview?.schemes?.total || chitSchemes.length,
    activeSchemes: overview?.schemes?.active || chitSchemes.filter(s => s.status === 'ACTIVE').length,
    totalCollectionToday: totalActualDailyCollection,
    totalRevenue: overview?.revenue?.total || 0,
    totalCollections: overview?.collections?.total || 0,
    pendingCollections: overview?.collections?.pending || 0,
    totalAuctions: overview?.auctions?.total || 0,
    paidMembers: passbookStats?.summary?.paidCount || 0,
    pendingMembers: passbookStats?.summary?.pendingCount || 0,
    collectionRate: collectionRate,
    defaulters: passbookStats?.summary?.backlogCount || 0,
    // Profit calculations from real passbook data
    dailyProfits: dailyProfits,
    monthlyProfits: monthlyProfits,
    dailyProfitPercentage: parseFloat(dailyProfitPercentage),
    monthlyProfitPercentage: parseFloat(monthlyProfitPercentage),
    totalExpectedDailyCollection: totalExpectedDailyCollection,
    totalActualDailyCollection: totalActualDailyCollection,
    totalExpectedMonthlyCollection: totalExpectedMonthlyCollection,
    // Backlog data
    totalBacklogAmount: passbookStats?.summary?.totalBacklogAmount || 0,
    backlogCount: passbookStats?.summary?.backlogCount || 0
  };

  const quickActions = [
    { id: 1, title: 'Add New Customer', icon: '👤', color: 'bg-blue-500', tab: 'customers' },
    { id: 2, title: 'Create New Chit Scheme', icon: '📋', color: 'bg-green-500', tab: 'schemes' },
    { id: 3, title: 'Record Collection', icon: '💰', color: 'bg-yellow-500', tab: 'collections' },
    { id: 4, title: 'Generate Reports', icon: '📊', color: 'bg-purple-500', tab: 'reports' }
  ];

  // Handle quick action button clicks
  const handleQuickAction = (action) => {
    if (onNavigate) {
      onNavigate(action.tab);
    }
  };

  // Format time ago helper
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  // Use real recent activities from API
  const recentActivities = dashboardData.recentActivities.map(activity => ({
    ...activity,
    time: getTimeAgo(activity.date)
  }));


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your chit fund business.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-lg text-gray-700">Loading dashboard data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Total Customers Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{overviewData.totalCustomers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  {overviewData.activeChits} active
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">👥</span>
              </div>
            </div>
          </div>

          {/* Active Schemes Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Active Schemes</p>
                <p className="text-3xl font-bold text-gray-900">{overviewData.activeSchemes}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {overviewData.totalSchemes} total schemes
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">📋</span>
              </div>
            </div>
          </div>

          {/* Today's Collection Card
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Collection</p>
                <p className="text-3xl font-bold text-gray-900">₹{overviewData.totalCollectionToday.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {overviewData.collectionRate}% collection rate
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>
          </div> */}

          {/* Total Revenue Card */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{overviewData.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {overviewData.totalCollections} collections
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">📈</span>
              </div>
            </div>
          </div> */}

          {/* Daily Stats Cards */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Paid Members</p>
                <p className="text-3xl font-bold text-green-600">{overviewData.paidMembers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {overviewData.pendingMembers} pending
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Members</p>
                <p className="text-3xl font-bold text-orange-600">{overviewData.pendingMembers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Need follow-up
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">⏰</span>
              </div>
            </div>
          </div> */}
{/* 
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Auctions</p>
                <p className="text-3xl font-bold text-gray-900">{overviewData.totalAuctions}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Conducted
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🔨</span>
              </div>
            </div>
          </div> */}
{/* 
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Defaulters</p>
                <p className="text-3xl font-bold text-red-600">{overviewData.defaulters}</p>
                <p className="text-xs text-red-500 mt-1">
                  Need attention
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">⚠️</span>
              </div>
            </div>
          </div> */}

          {/* Today's Collection Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Collection</p>
                <p className="text-3xl font-bold text-blue-600">₹{overviewData.totalActualDailyCollection.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {overviewData.collectionRate}% of ₹{overviewData.totalExpectedDailyCollection.toLocaleString()} expected
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>
          </div>

          {/* Daily Profits Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Daily Profits</p>
                <p className="text-3xl font-bold text-green-600">₹{overviewData.dailyProfits.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  {overviewData.dailyProfitPercentage}% of actual collections
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">📈</span>
              </div>
            </div>
          </div>

          {/* Monthly Profits Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Monthly Profits</p>
                <p className="text-3xl font-bold text-purple-600">₹{overviewData.monthlyProfits.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {overviewData.monthlyProfitPercentage}% of actual collections
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">💰</span>
              </div>
            </div>
          </div>

          {/* Backlog Amount Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Backlog Amount</p>
                <p className="text-3xl font-bold text-red-600">₹{overviewData.totalBacklogAmount.toLocaleString()}</p>
                <p className="text-xs text-red-600 mt-1">
                  {overviewData.backlogCount} customers pending
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Members */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  🔍
                </span>
                Search Members
              </h2>
              
              <div className="relative" ref={setSearchRef}>
                <input
                  type="text"
                  placeholder="Search by name or mobile number..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {customersLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => handleMemberClick(customer)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {customer.photo ? (
                              <img
                                src={customer.photo}
                                alt={`${customer.name} photo`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {customer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{customer.name}</p>
                              <p className="text-sm text-gray-600">{customer.mobile}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">ID: M{customer.id.toString().padStart(4, '0')}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              customer.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {customer.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-gray-500 text-center">
                      <div className="text-4xl mb-2">🔍</div>
                      <p>No members found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  ⚡
                </span>
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className={`${action.color} text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                      <span className="font-semibold text-lg">{action.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Backlog Details */}
        {passbookStats?.breakdown?.backlogs && passbookStats.breakdown.backlogs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  ⚠️
                </span>
                Pending Payments (Backlogs)
              </h2>
              <span className="text-sm text-red-600 font-medium">
                {passbookStats.breakdown.backlogs.length} customers
              </span>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {passbookStats.breakdown.backlogs.slice(0, 10).map((backlog, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-medium text-sm">
                          {backlog.customerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{backlog.customerName}</p>
                        <p className="text-sm text-gray-600">{backlog.customerMobile}</p>
                        <p className="text-xs text-gray-500">{backlog.schemeName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">₹{backlog.backlogAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        Expected: ₹{backlog.expectedAmount} | Paid: ₹{backlog.actualAmount}
                      </p>
                    </div>
                  </div>
                ))}
                {passbookStats.breakdown.backlogs.length > 10 && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">
                      And {passbookStats.breakdown.backlogs.length - 10} more customers with pending payments
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                📈
              </span>
              Recent Activities
            </h2>
            <button 
              onClick={() => {
                // Refresh recent activities
                fetchRecentActivities().then(activities => {
                  setDashboardData(prev => ({ ...prev, recentActivities: activities }));
                });
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activity.color === 'green' ? 'bg-green-100' :
                      activity.color === 'blue' ? 'bg-blue-100' :
                      activity.color === 'purple' ? 'bg-purple-100' :
                      'bg-gray-100'
                    } group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-xl">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      {activity.customer && (
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.customer.name} • {activity.customer.mobile}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount > 0 && (
                      <p className="font-bold text-lg text-gray-900">₹{activity.amount.toLocaleString()}</p>
                    )}
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">No recent activities</p>
                <p className="text-gray-400 text-sm mt-2">Activities will appear here as they happen</p>
              </div>
            )}
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
                      <p className="font-medium">{selectedPassbookScheme?.name || 'No schemes'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCustomer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      selectedCustomer.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
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

              {/* Add Passbook Entry Button */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Passbook Entries</h3>
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

              {/* Add Passbook Entry Form Modal */}
              {showPassbookForm && (
                <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-60">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4">
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
                  <div className="max-h-80 overflow-y-auto">
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
                          <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
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

              {/* Print Options */}
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  onClick={handlePrintPassbook}
                  disabled={isPrinting || !passbookEntries || passbookEntries.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isPrinting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Printing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Passbook
                    </>
                  )}
                </button>
                <button 
                  onClick={handleExportToPDF}
                  disabled={isGeneratingPDF || !passbookEntries || passbookEntries.length === 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export to PDF
                    </>
                  )}
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
    </div>
  );
};

export default AdminDashboard;

import { create } from 'zustand';

const API_BASE_URL = 'http://localhost:5001/api';

const useCustomerStore = create((set, get) => ({
  // State
  customers: [],
  chitSchemes: [],
  loading: false,
  error: null,
  selectedCustomer: null,
  showCreateForm: false,
  editingCustomer: null,
  showPassbookModal: false,
  passbookEntries: {},
  passbookFormData: {
    month: '',
    date: '',
    dailyPayment: '',
    amount: '',
    chittiAmount: ''
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setShowCreateForm: (show) => set({ showCreateForm: show }),
  setEditingCustomer: (customer) => set({ editingCustomer: customer }),
  setShowPassbookModal: (show) => set({ showPassbookModal: show }),
  setPassbookFormData: (data) => set({ passbookFormData: data }),

  // Reset form data
  resetForm: () => set({
    selectedCustomer: null,
    editingCustomer: null,
    showCreateForm: false,
    showPassbookModal: false,
    passbookFormData: {
      month: '',
      date: '',
      dailyPayment: '',
      amount: '',
      chittiAmount: ''
    }
  }),

  // Fetch customers with pagination and filtering
  fetchCustomers: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/customers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Handle nested response structure
      const customers = responseData.data?.customers || responseData.customers || responseData;
      
      set({ 
        customers: Array.isArray(customers) ? customers : [],
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ 
        error: error.message || 'Failed to fetch customers',
        loading: false 
      });
    }
  },

  // Fetch single customer by ID
  fetchCustomerById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const customer = responseData.data?.customer || responseData.customer || responseData;
      
      set({ 
        selectedCustomer: customer,
        loading: false 
      });
      
      return customer;
    } catch (error) {
      console.error('Error fetching customer:', error);
      set({ 
        error: error.message || 'Failed to fetch customer',
        loading: false 
      });
      return null;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      set({ loading: true, error: null });
      
      // Only send valid schema fields with proper data types
      const dataToSend = {
        name: customerData.name,
        mobile: customerData.mobile,
        address: customerData.address,
        schemeId: customerData.schemeId,
        startDate: customerData.startDate,
        lastDate: customerData.lastDate || null,
        amountPerDay: parseInt(customerData.amountPerDay) || 0,
        duration: parseInt(customerData.duration) || 0,
        durationType: customerData.durationType?.toUpperCase() || 'MONTHS',
        group: customerData.group,
        status: customerData.status,
        photo: customerData.photo || null
      };

      console.log('Sending data to API:', dataToSend);
      console.log('Data types:', {
        amountPerDay: typeof dataToSend.amountPerDay,
        duration: typeof dataToSend.duration,
        photo: typeof dataToSend.photo
      });

      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const newCustomer = responseData.data?.customer || responseData.customer || responseData;
      
      set(state => ({
        customers: [...state.customers, newCustomer],
        loading: false
      }));
      
      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      set({ 
        error: error.message || 'Failed to create customer',
        loading: false 
      });
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      set({ loading: true, error: null });
      
      // Only send valid schema fields with proper data types for update
      const dataToSend = {};
      
      // Only include fields that are provided and valid
      if (customerData.name !== undefined) dataToSend.name = customerData.name;
      if (customerData.mobile !== undefined) dataToSend.mobile = customerData.mobile;
      if (customerData.address !== undefined) dataToSend.address = customerData.address;
      if (customerData.schemeId !== undefined) dataToSend.schemeId = customerData.schemeId;
      if (customerData.startDate !== undefined) dataToSend.startDate = customerData.startDate;
      if (customerData.lastDate !== undefined) dataToSend.lastDate = customerData.lastDate;
      if (customerData.amountPerDay !== undefined) dataToSend.amountPerDay = parseInt(customerData.amountPerDay);
      if (customerData.duration !== undefined) dataToSend.duration = parseInt(customerData.duration);
      if (customerData.durationType !== undefined) dataToSend.durationType = customerData.durationType?.toUpperCase();
      if (customerData.group !== undefined) dataToSend.group = customerData.group;
      if (customerData.status !== undefined) dataToSend.status = customerData.status;
      if (customerData.photo !== undefined) dataToSend.photo = customerData.photo;

      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const updatedCustomer = responseData.data?.customer || responseData.customer || responseData;
      
      set(state => ({
        customers: state.customers.map(customer => 
          customer.id === id ? updatedCustomer : customer
        ),
        loading: false
      }));
      
      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer:', error);
      set({ 
        error: error.message || 'Failed to update customer',
        loading: false 
      });
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id),
        loading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      set({ 
        error: error.message || 'Failed to delete customer',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch chit schemes for dropdown
  fetchChitSchemes: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`${API_BASE_URL}/chit-schemes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Handle nested response structure
      const schemes = responseData.data?.schemes || responseData.schemes || responseData;
      
      set({ 
        chitSchemes: Array.isArray(schemes) ? schemes : [],
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching chit schemes:', error);
      set({ 
        error: error.message || 'Failed to fetch chit schemes',
        loading: false 
      });
    }
  },

  // Passbook actions
  addPassbookEntry: (customerId, entryData) => {
    set(state => ({
      passbookEntries: {
        ...state.passbookEntries,
        [customerId]: [...(state.passbookEntries[customerId] || []), {
          ...entryData,
          id: Date.now()
        }]
      }
    }));
  },

  removePassbookEntry: (customerId, entryId) => {
    set(state => ({
      passbookEntries: {
        ...state.passbookEntries,
        [customerId]: state.passbookEntries[customerId]?.filter(entry => entry.id !== entryId) || []
      }
    }));
  },

  getPassbookEntries: (customerId) => {
    return get().passbookEntries[customerId] || [];
  }
}));

export default useCustomerStore;

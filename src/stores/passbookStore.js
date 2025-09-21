import { create } from 'zustand';
import apiConfig from '../components/Config';

const API_BASE_URL = `${apiConfig.baseUrl}`;

const usePassbookStore = create((set, get) => ({
  // State
  entries: [],
  customer: null,
  loading: false,
  error: null,
  showAddForm: false,
  formData: {
    month: '',
    date: '',
    dailyPayment: '',
    amount: '',
    chittiAmount: '',
    type: 'MANUAL',
    paymentMethod: 'CASH',
    paymentFrequency: 'DAILY',
    chitLifting: 'NO'
  },

  // Actions
  setShowAddForm: (show) => set({ showAddForm: show }),
  
  setFormData: (data) => set({ formData: { ...get().formData, ...data } }),
  
  resetForm: () => set({
    formData: {
      month: '',
      date: '',
      dailyPayment: '',
      amount: '',
      chittiAmount: '',
      type: 'MANUAL',
      paymentMethod: 'CASH',
      paymentFrequency: 'DAILY',
      chitLifting: 'NO'
    }
  }),

  // Fetch passbook entries for a customer
  fetchPassbookEntries: async (customerId, filters = {}) => {
    try {
      set({ loading: true, error: null });
      
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.month) queryParams.append('month', filters.month);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const url = `${API_BASE_URL}/passbook/customer/${customerId}?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch passbook entries');
      }

      const data = await response.json();
      
      set({
        entries: data.data?.entries || [],
        customer: data.data?.customer || null,
        loading: false
      });

      return data.data;
    } catch (error) {
      console.error('Error fetching passbook entries:', error);
      set({ 
        error: error.message, 
        loading: false,
        entries: [],
        customer: null
      });
      throw error;
    }
  },

  // Create new passbook entry
  createPassbookEntry: async (customerId, entryData) => {
    try {
      set({ loading: true, error: null });
      
      // Validate and format date
      const dateObj = new Date(entryData.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format');
      }
      
      const payload = {
        customerId,
        month: parseInt(entryData.month),
        date: dateObj.toISOString(),
        dailyPayment: parseInt(entryData.dailyPayment),
        amount: parseInt(entryData.amount),
        chittiAmount: parseInt(entryData.chittiAmount),
        type: entryData.type || 'MANUAL',
        paymentMethod: entryData.paymentMethod || 'CASH',
        paymentFrequency: entryData.paymentFrequency || 'DAILY',
        chitLifting: entryData.chitLifting || 'NO'
      };
      
      console.log('Creating passbook entry with payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/passbook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create passbook entry');
      }

      const data = await response.json();
      
      // Refresh entries after creating
      await get().fetchPassbookEntries(customerId);
      
      set({ loading: false });
      return data.data;
    } catch (error) {
      console.error('Error creating passbook entry:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update passbook entry
  updatePassbookEntry: async (customerId, entryData) => {
    try {
      set({ loading: true, error: null });
      
      // Find the entry to update (assuming we have the entry ID in the form data)
      const { entries } = get();
      const entryToUpdate = entries.find(entry => 
        entry.month === parseInt(entryData.month) && 
        entry.type === entryData.type
      );
      
      if (!entryToUpdate) {
        throw new Error('Entry not found for updating');
      }
      
      // Validate and format date
      const dateObj = new Date(entryData.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format');
      }
      
      const payload = {
        month: parseInt(entryData.month),
        date: dateObj.toISOString(),
        dailyPayment: parseInt(entryData.dailyPayment),
        amount: parseInt(entryData.amount),
        chittiAmount: parseInt(entryData.chittiAmount),
        paymentMethod: entryData.paymentMethod || 'CASH',
        paymentFrequency: entryData.paymentFrequency || 'DAILY',
        chitLifting: entryData.chitLifting || 'NO'
      };
      
      console.log('Updating passbook entry with payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/passbook/${entryToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update passbook entry');
      }

      const data = await response.json();
      
      // Refresh entries after updating
      await get().fetchPassbookEntries(customerId);
      
      set({ loading: false });
      return data.data;
    } catch (error) {
      console.error('Error updating passbook entry:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete passbook entry
  deletePassbookEntry: async (entryId) => {
    try {
      set({ loading: true, error: null });
      
      const response = await fetch(`${API_BASE_URL}/passbook/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete passbook entry');
      }

      // Refresh entries after deleting
      const { customer } = get();
      if (customer) {
        await get().fetchPassbookEntries(customer.id);
      }
      
      set({ loading: false });
    } catch (error) {
      console.error('Error deleting passbook entry:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },


  // Clear error
  clearError: () => set({ error: null })
}));

export default usePassbookStore;

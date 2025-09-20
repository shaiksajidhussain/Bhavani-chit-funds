import { create } from 'zustand';
import apiConfig from '../components/Config';

const useAuctionStore = create((set, get) => ({
  // State
  auctions: [],
  chitSchemes: [],
  members: [],
  loading: false,
  error: null,
  selectedAuction: null,
  showCreateForm: false,
  editingAuction: null,
  formData: {
    chitSchemeId: '',
    chitValue: '',
    auctionDate: '',
    winningMemberId: '',
    memberId: '',
    amountReceived: '',
    discountAmount: '',
    newDailyPayment: '',
    previousDailyPayment: '',
    status: 'SCHEDULED',
    remarks: ''
  },

  // Actions
  setShowCreateForm: (show) => set({ showCreateForm: show }),
  setEditingAuction: (auction) => set({ editingAuction: auction }),
  setSelectedAuction: (auction) => set({ selectedAuction: auction }),
  setFormData: (data) => set({ formData: data }),
  clearError: () => set({ error: null }),

  // Reset form data
  resetForm: () => set({
    formData: {
      chitSchemeId: '',
      chitValue: '',
      auctionDate: '',
      winningMemberId: '',
      memberId: '',
      amountReceived: '',
      discountAmount: '',
      newDailyPayment: '',
      previousDailyPayment: '',
      status: 'SCHEDULED',
      remarks: ''
    },
    editingAuction: null
  }),

  // Fetch all auctions
  fetchAuctions: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.chitSchemeId) queryParams.append('chitSchemeId', filters.chitSchemeId);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const response = await fetch(`${apiConfig.baseUrl}/auctions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched auctions:', data);

      if (data.success) {
        set({ 
          auctions: data.data?.auctions || data.auctions || [],
          loading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch auctions');
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      set({ 
        error: error.message || 'Failed to fetch auctions',
        loading: false 
      });
    }
  },

  // Fetch single auction
  fetchAuctionById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiConfig.baseUrl}/auctions/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched auction:', data);

      if (data.success) {
        set({ 
          selectedAuction: data.data?.auction || data.auction,
          loading: false 
        });
        return data.data?.auction || data.auction;
      } else {
        throw new Error(data.message || 'Failed to fetch auction');
      }
    } catch (error) {
      console.error('Error fetching auction:', error);
      set({ 
        error: error.message || 'Failed to fetch auction',
        loading: false 
      });
      return null;
    }
  },

  // Create auction
  createAuction: async (auctionData) => {
    set({ loading: true, error: null });
    try {
      // Validate and convert date
      let auctionDate = auctionData.auctionDate;
      if (auctionDate) {
        const dateObj = new Date(auctionDate);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Invalid date format');
        }
        auctionDate = dateObj.toISOString();
      }

      // Validate required fields
      if (!auctionData.chitSchemeId) {
        throw new Error('Chit scheme is required');
      }
      if (!auctionDate) {
        throw new Error('Auction date is required');
      }

      // Prepare data for API - only send required fields
      const dataToSend = {
        chitSchemeId: auctionData.chitSchemeId,
        auctionDate: auctionDate,
        winningMemberId: auctionData.winningMemberId || null,
        amountReceived: parseInt(auctionData.amountReceived) || 0,
        discountAmount: parseInt(auctionData.discountAmount) || 0,
        newDailyPayment: auctionData.newDailyPayment ? parseInt(auctionData.newDailyPayment) : undefined,
        previousDailyPayment: auctionData.previousDailyPayment ? parseInt(auctionData.previousDailyPayment) : undefined,
        status: auctionData.status || 'SCHEDULED',
        remarks: auctionData.remarks || null
      };

      console.log('Creating auction with data:', dataToSend);
      console.log('Form data received:', auctionData);

      const response = await fetch(`${apiConfig.baseUrl}/auctions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.response = { data: errorData };
        throw error;
      }

      const data = await response.json();
      console.log('Created auction:', data);

      if (data.success) {
        // Refresh auctions list
        await get().fetchAuctions();
        set({ loading: false });
        return data.data?.auction || data.auction;
      } else {
        throw new Error(data.message || 'Failed to create auction');
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      set({ 
        error: error.message || 'Failed to create auction',
        loading: false 
      });
      throw error;
    }
  },

  // Update auction
  updateAuction: async (id, auctionData) => {
    set({ loading: true, error: null });
    try {
      // Validate and convert date if present
      let auctionDate = auctionData.auctionDate;
      if (auctionDate) {
        const dateObj = new Date(auctionDate);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Invalid date format');
        }
        auctionDate = dateObj.toISOString();
      }

      // For updates, exclude chitSchemeId as it cannot be changed
      const { chitSchemeId: _chitSchemeId, chitValue: _chitValue, memberId: _memberId, ...updateFields } = auctionData;
      
      const dataToSend = {
        ...updateFields,
        ...(auctionDate && { auctionDate }),
        ...(auctionData.amountReceived && { amountReceived: parseInt(auctionData.amountReceived) }),
        ...(auctionData.discountAmount && { discountAmount: parseInt(auctionData.discountAmount) }),
        ...(auctionData.newDailyPayment && { newDailyPayment: parseInt(auctionData.newDailyPayment) }),
        ...(auctionData.previousDailyPayment && { previousDailyPayment: parseInt(auctionData.previousDailyPayment) })
      };

      // Remove undefined values to avoid validation issues
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });

      console.log('Updating auction with data:', dataToSend);

      const response = await fetch(`${apiConfig.baseUrl}/auctions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.response = { data: errorData };
        throw error;
      }

      const data = await response.json();
      console.log('Updated auction:', data);

      if (data.success) {
        // Refresh auctions list
        await get().fetchAuctions();
        set({ loading: false });
        return data.data?.auction || data.auction;
      } else {
        throw new Error(data.message || 'Failed to update auction');
      }
    } catch (error) {
      console.error('Error updating auction:', error);
      set({ 
        error: error.message || 'Failed to update auction',
        loading: false 
      });
      throw error;
    }
  },

  // Delete auction
  deleteAuction: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiConfig.baseUrl}/auctions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.response = { data: errorData };
        throw error;
      }

      const data = await response.json();
      console.log('Deleted auction:', data);

      if (data.success) {
        // Refresh auctions list
        await get().fetchAuctions();
        set({ loading: false });
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete auction');
      }
    } catch (error) {
      console.error('Error deleting auction:', error);
      set({ 
        error: error.message || 'Failed to delete auction',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch chit schemes for dropdown
  fetchChitSchemes: async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/chit-schemes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched chit schemes:', data);

      if (data.success) {
        set({ 
          chitSchemes: data.data?.schemes || data.schemes || []
        });
      } else {
        throw new Error(data.message || 'Failed to fetch chit schemes');
      }
    } catch (error) {
      console.error('Error fetching chit schemes:', error);
      set({ 
        error: error.message || 'Failed to fetch chit schemes'
      });
    }
  },

  // Fetch members for dropdown
  fetchMembers: async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/customers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched members:', data);

      if (data.success) {
        set({ 
          members: data.data?.customers || data.customers || []
        });
      } else {
        throw new Error(data.message || 'Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      set({ 
        error: error.message || 'Failed to fetch members'
      });
    }
  },

  // Get upcoming auctions
  fetchUpcomingAuctions: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${apiConfig.baseUrl}/auctions/upcoming/list?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched upcoming auctions:', data);

      if (data.success) {
        set({ 
          auctions: data.data?.auctions || data.auctions || [],
          loading: false 
        });
      } else {
        throw new Error(data.message || 'Failed to fetch upcoming auctions');
      }
    } catch (error) {
      console.error('Error fetching upcoming auctions:', error);
      set({ 
        error: error.message || 'Failed to fetch upcoming auctions',
        loading: false 
      });
    }
  }
}));

export default useAuctionStore;

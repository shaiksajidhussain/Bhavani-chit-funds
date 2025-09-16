import { create } from 'zustand';

const API_BASE_URL = 'http://localhost:5001/api';

export const useChitSchemeStore = create((set) => ({
  // State
  schemes: [],
  loading: false,
  error: null,
  selectedScheme: null,
  showCreateForm: false,
  editingScheme: null,
  showMembersModal: false,
  schemeMembers: [],
  membersLoading: false,
  membersError: null,
  membersStats: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedScheme: (scheme) => set({ selectedScheme: scheme }),
  setShowCreateForm: (show) => set({ showCreateForm: show }),
  setEditingScheme: (scheme) => set({ editingScheme: scheme }),
  setShowMembersModal: (show) => set({ showMembersModal: show }),

  // Fetch all chit schemes
  fetchSchemes: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chit-schemes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chit schemes');
      }

      const responseData = await response.json();
      // Handle nested response structure: { success: true, data: { schemes: [...] } }
      const schemes = responseData.data?.schemes || responseData.schemes || responseData;
      set({ schemes: Array.isArray(schemes) ? schemes : [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create new chit scheme
  createScheme: async (schemeData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chit-schemes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schemeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to create chit scheme');
        error.response = { data: errorData };
        throw error;
      }

      const responseData = await response.json();
      // Handle nested response structure: { success: true, data: { scheme: ... } }
      const newScheme = responseData.data?.scheme || responseData.data || responseData;
      set((state) => ({
        schemes: [...(Array.isArray(state.schemes) ? state.schemes : []), newScheme],
        loading: false,
        showCreateForm: false,
        editingScheme: null,
      }));
      return newScheme;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update chit scheme
  updateScheme: async (id, schemeData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chit-schemes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schemeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to update chit scheme');
        error.response = { data: errorData };
        throw error;
      }

      const responseData = await response.json();
      // Handle nested response structure: { success: true, data: { scheme: ... } }
      const updatedScheme = responseData.data?.scheme || responseData.data || responseData;
      set((state) => ({
        schemes: Array.isArray(state.schemes) ? state.schemes.map(scheme => 
          scheme.id === id ? updatedScheme : scheme
        ) : [],
        loading: false,
        showCreateForm: false,
        editingScheme: null,
      }));
      return updatedScheme;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete chit scheme
  deleteScheme: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chit-schemes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to delete chit scheme');
        error.response = { data: errorData };
        throw error;
      }

      set((state) => ({
        schemes: Array.isArray(state.schemes) ? state.schemes.filter(scheme => scheme.id !== id) : [],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get chit scheme by ID
  fetchSchemeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chit-schemes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chit scheme');
      }

      const responseData = await response.json();
      // Handle nested response structure: { success: true, data: { ... } }
      const scheme = responseData.data || responseData;
      set({ selectedScheme: scheme, loading: false });
      return scheme;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get scheme statistics
  fetchSchemeStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chit-schemes/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scheme statistics');
      }

      return await response.json();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Fetch scheme members
  fetchSchemeMembers: async (schemeId, filters = {}) => {
    set({ membersLoading: true, membersError: null });
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.group) queryParams.append('group', filters.group);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const url = `${API_BASE_URL}/chit-schemes/${schemeId}/members?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch scheme members');
      }

      const data = await response.json();
      
      set({
        schemeMembers: data.data?.members || [],
        membersStats: data.data?.stats || null,
        membersLoading: false
      });

      return data.data;
    } catch (error) {
      console.error('Error fetching scheme members:', error);
      set({ 
        membersError: error.message, 
        membersLoading: false,
        schemeMembers: [],
        membersStats: null
      });
      throw error;
    }
  },

  // Reset form data
  resetForm: () => {
    set({
      editingScheme: null,
      showCreateForm: false,
      selectedScheme: null,
      showMembersModal: false,
    });
  },
}));

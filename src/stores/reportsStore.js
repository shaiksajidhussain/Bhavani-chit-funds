import { create } from 'zustand';

const useReportsStore = create((set, get) => ({
  // State
  reportData: {
    totalCollection: 0,
    paidMembers: 0,
    pendingMembers: 0,
    defaulters: 0,
    collectionRate: 0
  },
  topCustomers: [],
  schemePerformance: [],
  loading: false,
  error: null,
  selectedReport: 'daily',
  dateRange: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  },

  // Actions
  setSelectedReport: (reportType) => set({ selectedReport: reportType }),
  
  setDateRange: (dateRange) => set({ dateRange }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Fetch daily report
  fetchDailyReport: async (date) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5001/api/reports/daily?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        set({ 
          reportData: result.data,
          loading: false 
        });
      } else {
        throw new Error(result.message || 'Failed to fetch daily report');
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  // Fetch monthly report
  fetchMonthlyReport: async (year, month) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5001/api/reports/monthly?year=${year}&month=${month}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        set({ 
          reportData: result.data,
          loading: false 
        });
      } else {
        throw new Error(result.message || 'Failed to fetch monthly report');
      }
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  // Fetch yearly report
  fetchYearlyReport: async (year) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5001/api/reports/yearly?year=${year}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        set({ 
          reportData: result.data,
          loading: false 
        });
      } else {
        throw new Error(result.message || 'Failed to fetch yearly report');
      }
    } catch (error) {
      console.error('Error fetching yearly report:', error);
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  // Fetch top customers
  fetchTopCustomers: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:5001/api/reports/top-customers?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        set({ 
          topCustomers: result.data,
          loading: false 
        });
      } else {
        throw new Error(result.message || 'Failed to fetch top customers');
      }
    } catch (error) {
      console.error('Error fetching top customers:', error);
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  // Fetch scheme performance
  fetchSchemePerformance: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/reports/scheme-performance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        set({ 
          schemePerformance: result.data,
          loading: false 
        });
      } else {
        throw new Error(result.message || 'Failed to fetch scheme performance');
      }
    } catch (error) {
      console.error('Error fetching scheme performance:', error);
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  // Fetch report based on selected type
  fetchReport: async () => {
    const { selectedReport, dateRange } = get();
    
    switch (selectedReport) {
      case 'daily': {
        await get().fetchDailyReport(dateRange.startDate);
        break;
      }
      case 'monthly': {
        const month = new Date(dateRange.startDate).getMonth() + 1;
        const year = new Date(dateRange.startDate).getFullYear();
        await get().fetchMonthlyReport(year, month);
        break;
      }
      case 'yearly': {
        const yearOnly = new Date(dateRange.startDate).getFullYear();
        await get().fetchYearlyReport(yearOnly);
        break;
      }
      case 'customer': {
        // For customer report, we'll use daily data but show customer-specific info
        await get().fetchDailyReport(dateRange.startDate);
        break;
      }
      case 'scheme': {
        // For scheme report, we'll use daily data but show scheme-specific info
        await get().fetchDailyReport(dateRange.startDate);
        break;
      }
      default: {
        await get().fetchDailyReport(dateRange.startDate);
      }
    }

    // Always fetch top customers and scheme performance for the detailed views
    await get().fetchTopCustomers();
    await get().fetchSchemePerformance();
  }
}));

export default useReportsStore;

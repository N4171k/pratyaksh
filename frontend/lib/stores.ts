import { create } from 'zustand';
import { Service, RiskSummary, apiClient } from '@/lib/api-client';

// Auth Store
interface AuthState {
  isAuthenticated: boolean;
  sessionId: string | null;
  userEmail: string | null;
  isLoading: boolean;
  error: string | null;
  
  setAuth: (sessionId: string, email: string) => void;
  logout: () => Promise<void>;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  sessionId: null,
  userEmail: null,
  isLoading: true,
  error: null,

  setAuth: (sessionId, email) => {
    apiClient.setSessionId(sessionId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('session_id', sessionId);
      sessionStorage.setItem('user_email', email);
    }
    set({ isAuthenticated: true, sessionId, userEmail: email, isLoading: false, error: null });
  },

  logout: async () => {
    const sessionId = get().sessionId;
    if (sessionId) {
      await apiClient.logout(sessionId);
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('session_id');
      sessionStorage.removeItem('user_email');
    }
    set({ isAuthenticated: false, sessionId: null, userEmail: null, error: null });
  },

  checkSession: () => {
    if (typeof window !== 'undefined') {
      const sessionId = sessionStorage.getItem('session_id');
      const email = sessionStorage.getItem('user_email');
      if (sessionId && email) {
        apiClient.setSessionId(sessionId);
        set({ isAuthenticated: true, sessionId, userEmail: email, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },
}));

// Scan Store
interface ScanState {
  status: 'idle' | 'pending' | 'scanning' | 'analyzing' | 'complete' | 'error';
  jobId: string | null;
  progress: number;
  emailsScanned: number;
  servicesFound: number;
  message: string;
  
  startScan: () => Promise<void>;
  pollStatus: () => Promise<void>;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set, get) => ({
  status: 'idle',
  jobId: null,
  progress: 0,
  emailsScanned: 0,
  servicesFound: 0,
  message: '',

  startScan: async () => {
    set({ status: 'pending', progress: 0, message: 'Initiating scan...' });
    
    const sessionId = useAuthStore.getState().sessionId;
    if (!sessionId) {
      set({ status: 'error', message: 'Not authenticated' });
      return;
    }
    
    const response = await apiClient.scan.start(sessionId);
    if (response.error) {
      set({ status: 'error', message: response.error });
      return;
    }
    
    set({ jobId: response.data?.scan_id || sessionId, status: 'scanning' });
    get().pollStatus();
  },

  pollStatus: async () => {
    const { status } = get();
    const sessionId = useAuthStore.getState().sessionId;
    if (!sessionId || status === 'complete' || status === 'error') return;

    const response = await apiClient.scan.getProgress(sessionId);
    if (response.error) {
      set({ status: 'error', message: response.error });
      return;
    }

    const data = response.data!;
    const newStatus = data.status === 'completed' ? 'complete' : 
                      data.status === 'in_progress' ? 'scanning' : 
                      data.status as any;
    set({
      status: newStatus,
      progress: data.progress,
      emailsScanned: data.total_emails || 0,
      servicesFound: data.services_found,
      message: data.current_step || '',
    });

    if (newStatus !== 'complete' && newStatus !== 'error') {
      setTimeout(() => get().pollStatus(), 1000);
    }
  },

  reset: () => set({
    status: 'idle',
    jobId: null,
    progress: 0,
    emailsScanned: 0,
    servicesFound: 0,
    message: '',
  }),
}));

// Services Store
interface ServicesState {
  services: Service[];
  summary: RiskSummary | null;
  selectedIds: Set<string>;
  filter: 'all' | 'high' | 'medium' | 'low' | 'breached';
  searchQuery: string;
  viewMode: 'map' | 'list' | 'grid';
  isLoading: boolean;
  
  setServices: (services: Service[], summary: RiskSummary) => void;
  toggleSelect: (id: string) => void;
  selectAll: (filter?: 'high' | 'breached') => void;
  clearSelection: () => void;
  setFilter: (filter: 'all' | 'high' | 'medium' | 'low' | 'breached') => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'map' | 'list' | 'grid') => void;
  getFilteredServices: () => Service[];
  loadResults: () => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  summary: null,
  selectedIds: new Set(),
  filter: 'all',
  searchQuery: '',
  viewMode: 'map',
  isLoading: false,

  setServices: (services, summary) => set({ services, summary }),

  toggleSelect: (id) => {
    const newSelected = new Set(get().selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    set({ selectedIds: newSelected });
  },

  selectAll: (filter) => {
    const services = get().services;
    let toSelect: Service[];
    
    if (filter === 'high') {
      toSelect = services.filter(s => s.risk_score >= 7);
    } else if (filter === 'breached') {
      toSelect = services.filter(s => s.breach_count > 0);
    } else {
      toSelect = services;
    }
    
    set({ selectedIds: new Set(toSelect.map(s => s.id)) });
  },

  clearSelection: () => set({ selectedIds: new Set() }),

  setFilter: (filter) => set({ filter }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setViewMode: (mode) => set({ viewMode: mode }),

  getFilteredServices: () => {
    const { services, filter, searchQuery } = get();
    let filtered = [...services];

    // Apply risk filter
    if (filter === 'high') {
      filtered = filtered.filter(s => s.risk_score >= 7);
    } else if (filter === 'medium') {
      filtered = filtered.filter(s => s.risk_score >= 4 && s.risk_score < 7);
    } else if (filter === 'low') {
      filtered = filtered.filter(s => s.risk_score < 4);
    } else if (filter === 'breached') {
      filtered = filtered.filter(s => s.breach_count > 0);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.service_name.toLowerCase().includes(query) ||
        s.domain.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  loadResults: async () => {
    set({ isLoading: true });
    const sessionId = useAuthStore.getState().sessionId;
    if (!sessionId) {
      set({ isLoading: false });
      return;
    }
    
    const response = await apiClient.scan.getResults(sessionId);
    
    if (response.data) {
      const services = response.data.services;
      set({
        services,
        summary: {
          total_services: services.length,
          high_risk_count: services.filter(s => s.risk_score >= 7).length,
          medium_risk_count: services.filter(s => s.risk_score >= 4 && s.risk_score < 7).length,
          low_risk_count: services.filter(s => s.risk_score < 4).length,
          breached_count: services.filter(s => s.breach_count > 0).length,
          estimated_annual_value: services.length * 10, // Estimated $10/service/year
        },
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));

// UI Store
interface UIState {
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  modalData: unknown;
  
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (modal: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  activeModal: null,
  modalData: null,

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));

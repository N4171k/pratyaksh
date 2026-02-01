const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  clearSession() {
    this.sessionId = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.sessionId) {
      headers['X-Session-ID'] = this.sessionId;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || 'An error occurred',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: 'Network error. Please check your connection.',
        status: 0,
      };
    }
  }

  // Auth endpoints
  async getAuthUrl(): Promise<ApiResponse<{ authorization_url: string; state: string }>> {
    return this.request('/api/auth/google', { method: 'GET' });
  }

  async checkAuthStatus(sessionId: string): Promise<ApiResponse<{ 
    authenticated: boolean; 
    session_valid: boolean;
    email?: string;
    expires_at?: string;
  }>> {
    return this.request(`/api/auth/status?session_id=${sessionId}`);
  }

  async logout(sessionId: string): Promise<ApiResponse<{ status: string; data_purged: boolean }>> {
    const result = await this.request<{ status: string; data_purged: boolean }>(
      `/api/auth/logout?session_id=${sessionId}`, 
      { method: 'POST' }
    );
    this.clearSession();
    return result;
  }

  // Scan endpoints
  scan = {
    start: (sessionId: string, yearsBack: number = 5): Promise<ApiResponse<{ scan_id: string; status: string; message: string }>> => {
      return this.request('/api/scan/start', { 
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, years_back: yearsBack }),
      });
    },

    getProgress: (sessionId: string): Promise<ApiResponse<{
      status: string;
      progress: number;
      total_emails?: number;
      services_found: number;
      current_step?: string;
      error?: string;
    }>> => {
      return this.request(`/api/scan/progress?session_id=${sessionId}`);
    },

    getResults: (sessionId: string): Promise<ApiResponse<{
      services: Service[];
      scan_duration?: number;
      total_emails_scanned: number;
      completed_at?: string;
    }>> => {
      return this.request(`/api/scan/results?session_id=${sessionId}`);
    },

    cancel: (sessionId: string): Promise<ApiResponse<{ status: string; message: string }>> => {
      return this.request(`/api/scan/cancel?session_id=${sessionId}`, { method: 'DELETE' });
    },
  };

  // Risk endpoints
  risk = {
    getSummary: (sessionId: string): Promise<ApiResponse<{
      summary: RiskSummary;
      top_risk_services: Service[];
    }>> => {
      return this.request(`/api/risk/summary?session_id=${sessionId}`);
    },

    getScore: (sessionId: string): Promise<ApiResponse<{ risk_score: number; risk_level: string }>> => {
      return this.request(`/api/risk/score?session_id=${sessionId}`);
    },

    getRecommendations: (sessionId: string): Promise<ApiResponse<{ recommendations: any[] }>> => {
      return this.request(`/api/risk/recommendations?session_id=${sessionId}`);
    },
  };

  // Breaches endpoints
  breaches = {
    check: (sessionId: string, domains?: string[]): Promise<ApiResponse<{
      checked: number;
      breached: number;
      results: Record<string, any>;
    }>> => {
      return this.request(`/api/breaches/check?session_id=${sessionId}`, {
        method: 'POST',
        body: domains ? JSON.stringify({ domains }) : undefined,
      });
    },

    getStatus: (domain: string): Promise<ApiResponse<BreachInfo>> => {
      return this.request(`/api/breaches/status/${domain}`);
    },

    getSummary: (sessionId: string): Promise<ApiResponse<{
      total_services: number;
      checked: number;
      breached_count: number;
      exposed_data_types: string[];
      breached_services: any[];
    }>> => {
      return this.request(`/api/breaches/summary?session_id=${sessionId}`);
    },
  };

  // AI endpoints
  ai = {
    getStatus: (): Promise<ApiResponse<{ available: boolean; model?: string }>> => {
      return this.request('/api/ai/status');
    },

    categorize: (domain: string, emailSubject?: string): Promise<ApiResponse<{
      domain: string;
      service_name: string;
      category: string;
      data_sensitivity: number;
      privacy_email?: string;
      confidence: number;
    }>> => {
      return this.request('/api/ai/categorize', {
        method: 'POST',
        body: JSON.stringify({ domain, email_subject: emailSubject }),
      });
    },

    generateEmail: (request: {
      service_name: string;
      domain: string;
      user_email?: string;
      regulation?: string;
    }): Promise<ApiResponse<{
      service_name: string;
      domain: string;
      regulation: string;
      subject: string;
      body: string;
      to_email: string;
    }>> => {
      return this.request('/api/ai/generate-email', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    },

    getPrivacyEmail: (domain: string): Promise<ApiResponse<{
      domain: string;
      email: string;
      confidence: number;
      ai_generated: boolean;
    }>> => {
      return this.request(`/api/ai/privacy-email/${domain}`);
    },
  };

  // Actions endpoints
  actions = {
    generateDeletionEmails: (sessionId: string, services: Array<{
      domain: string;
      service_name: string;
      regulation?: string;
    }>): Promise<ApiResponse<{
      generated: number;
      emails: any[];
    }>> => {
      return this.request('/api/actions/generate-deletion-emails', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, services }),
      });
    },

    getServiceDetails: (sessionId: string, domain: string): Promise<ApiResponse<any>> => {
      return this.request(`/api/actions/service-details/${domain}?session_id=${sessionId}`);
    },

    killSwitch: (sessionId: string): Promise<ApiResponse<{
      generated_at: string;
      total_services: number;
      user_email: string;
      services: any[];
    }>> => {
      return this.request(`/api/actions/kill-switch?session_id=${sessionId}`, {
        method: 'POST',
      });
    },

    getKillSwitchStatus: (sessionId: string): Promise<ApiResponse<{
      status: string;
      generated_at?: string;
      total_services?: number;
      pending?: number;
      completed?: number;
    }>> => {
      return this.request(`/api/actions/kill-switch/status?session_id=${sessionId}`);
    },

    markCompleted: (sessionId: string, domain: string): Promise<ApiResponse<{ status: string; domain: string }>> => {
      return this.request(`/api/actions/mark-completed?session_id=${sessionId}&domain=${domain}`, {
        method: 'POST',
      });
    },

    export: (sessionId: string, format: string = 'json'): Promise<ApiResponse<any>> => {
      return this.request(`/api/actions/export?session_id=${sessionId}&format=${format}`);
    },
  };
}

// Types
export interface Service {
  id: string;
  domain: string;
  service_name: string;
  name: string; // Alias for service_name
  category: string;
  risk_score: number;
  data_sensitivity: number;
  breach_count: number;
  breach_status: 'safe' | 'breached' | 'unknown';
  last_breach_date?: string;
  first_seen_date: string;
  first_seen: string; // Alias for first_seen_date
  privacy_email?: string;
  logo_url?: string;
  data_collected: string[];
  estimated_data_value: number;
}

export interface BreachInfo {
  breach_count: number;
  breaches: Array<{
    name: string;
    date: string;
    data_classes: string[];
    accounts_affected: number;
  }>;
}

export interface RiskSummary {
  total_services: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  breached_count: number;
  estimated_annual_value: number;
}

export const apiClient = new ApiClient(API_BASE_URL);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  constructor(baseURL) {
    // In development, use the vite proxy to avoid CORS issues
    // The vite proxy is configured to forward /api/* to https://dev-api.eureky.ai/*
    if (import.meta.env.DEV) {
      this.baseURL = '/api'; // Use vite proxy in development
    } else {
      // In production, use the provided base URL or environment variable
      this.baseURL = baseURL || API_BASE_URL || '';
    }
  }

  // Handle 401 unauthorized responses
  handleUnauthorized() {
    // Clear auth token
    localStorage.removeItem('authToken');

    // Only redirect if we're in a browser environment and not already on login page
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Only add Authorization header if token exists and is valid
    if (token && token.trim()) {
      // Ensure token doesn't already have "Bearer " prefix
      const cleanToken = token.startsWith('Bearer ') ? token.replace(/^Bearer\s+/, '') : token;
      headers['Authorization'] = `Bearer ${cleanToken}`;
    }

    const config = {
      headers,
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          this.handleUnauthorized();
          throw new Error('Unauthorized - redirecting to login');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
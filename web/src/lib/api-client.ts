import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import type { ApiError, ApiResponse, PaginatedResponse } from '@/types/api';
import { API_BASE_URL } from '@/constants';
import { PROTECTED_ROUTES } from '@/constants';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Response interceptor: Handle common responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Return the response data directly
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;
      const requestUrl = error.config?.url;

      switch (status) {
        case 401:
          // Only redirect to login for protected routes, not for public pages
          // Example: Only redirect if the request is for /profile, /dashboard, etc.
          if (requestUrl && PROTECTED_ROUTES.some((route) => requestUrl.startsWith(route))) {
            console.log('Unauthorized access to protected route. Redirecting to login.');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          // Otherwise, just reject the error and do not redirect
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', error.response.data?.error);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', error.response.data?.error);
          break;

        case 429:
          // Rate limit exceeded
          console.error('Rate limit exceeded. Please try again later.');
          break;

        case 500:
          // Server error
          console.error('Server error:', error.response.data?.error);
          break;

        default:
          console.error('API Error:', error.response.data?.error || 'Unknown error');
      }

      // Return the structured error from the server
      // Server returns: {success: false, error: "message"}
      return Promise.reject({
        status,
        message: error.response.data?.error || 'An error occurred',
      });
    }

    // Network error or other issues
    if (error.request) {
      console.error('Network error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    }

    // Request setup error
    console.error('Request error:', error.message);
    return Promise.reject({
      status: 0,
      message: 'Request failed. Please try again.',
      code: 'REQUEST_ERROR',
    });
  }
);

// Generic API call wrapper with better error handling
export const apiCall = async <T>(
  requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
  const response = await requestFn();
  return response.data.data;
};

// Special API call for paginated responses
export const paginatedApiCall = async <T>(
  requestFn: () => Promise<AxiosResponse<PaginatedResponse<T>>>
): Promise<PaginatedResponse<T>> => {
  const response = await requestFn();
  return response.data;
};

// Health check utility for connection testing
export const healthCheck = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health');
    return true;
  } catch {
    return false;
  }
};

export default apiClient;

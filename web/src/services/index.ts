// Service layer exports for clean imports
export { authService } from './auth.service';
export { userService } from './user.service';
export { routineService } from './routine.service';

// Re-export commonly used utilities
export { apiClient, tokenManager, healthCheck } from '@/lib/api-client';

// Import for internal use
import { apiClient } from '@/lib/api-client';

// Health service
export const healthService = {
  checkConnection: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  getHealthStatus: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

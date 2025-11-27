import type { AuthResponse, ApiResponse } from '@/types/api';

import { apiClient, apiCall } from '@/lib/api-client';

export const OAuthService = {
  // Generate Google OAuth URL
  genGoogleOAuthUrl: async (): Promise<string> => {
    const response =
      await apiClient.get<ApiResponse<{ redirectUrl: string }>>('/auth/oauth/google');
    return response.data.data.redirectUrl;
  },

  // Handle Google OAuth callback
  googleOAuthCallback: async (code: string): Promise<AuthResponse> => {
    return await apiCall<AuthResponse>(() =>
      apiClient.get<ApiResponse<AuthResponse>>(
        `/auth/oauth/google/callback?code=${encodeURIComponent(code)}`
      )
    );
  },
};

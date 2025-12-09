import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/auth.service';

import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Async thunk for checking authentication
export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  try {
    // Fetch user data instead of just checking if authenticated
    const user = await authService.getCurrentUser();
    return { isAuthenticated: true, user };
  } catch (error) {
    console.error('Error in checkAuth thunk:', error);
    return { isAuthenticated: false, user: null };
  }
});

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    return;
  } catch (error) {
    console.error('Error in logout thunk:', error);
    return rejectWithValue('Failed to logout');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    setUser: (state, action) => {
      if (action.payload) {
        // Ensure the payload matches User type structure
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.fullName || '',
          username: action.payload.username || '',
          avatarUrl: action.payload.avatarUrl,
          bio: action.payload.bio || null,
          isActive: action.payload.isActive !== false,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt,
          hasPassword: action.payload.hasPassword ?? true,
          providers: action.payload.providers || [],
        } as User;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        // Ensure user data matches User type with all required fields
        state.user = action.payload.user
          ? ({
              id: action.payload.user.id,
              email: action.payload.user.email,
              fullName: action.payload.user.fullName || '',
              username: action.payload.user.username || '',
              avatarUrl: action.payload.user.avatarUrl,
              bio: action.payload.user.bio || null,
              isActive: action.payload.user.isActive !== false,
              createdAt: action.payload.user.createdAt,
              updatedAt: action.payload.user.updatedAt,
              hasPassword: action.payload.user.hasPassword ?? true,
              providers: action.payload.user.providers || [],
            } as User)
          : null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

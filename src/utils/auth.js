// src/utils/auth.js
import { setData, setError, setLoading } from "../store/userSlice";

/**
 * Logout utility function that can be used anywhere in the app
 * @param {Function} dispatch - Redux dispatch function
 * @returns {void}
 */
export const logout = (dispatch) => {
  try {
    console.log('🚪 Logging out user...');
    
    // Clear localStorage
    localStorage.removeItem('github_token');
    
    // Clear Redux state
    if (dispatch) {
      dispatch(setData(null));
      dispatch(setError(null));
      dispatch(setLoading(false));
    }
    
    // Clear any other stored data if needed
    // localStorage.removeItem('user_preferences');
    // sessionStorage.clear();
    
    // Redirect to home page
    window.location.href = '/';
    
    console.log('✅ Successfully logged out');
  } catch (error) {
    console.error('❌ Error during logout:', error);
    
    // Even if there's an error, try to clear localStorage and redirect
    localStorage.removeItem('github_token');
    window.location.href = '/';
  }
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('github_token');
  return !!token;
};

/**
 * Get current auth token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem('github_token');
};

/**
 * Clear all auth data (for cleanup)
 * @returns {void}
 */
export const clearAuthData = () => {
  localStorage.removeItem('github_token');
  // Add any other cleanup here
};
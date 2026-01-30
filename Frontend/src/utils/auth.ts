// src/utils/auth.ts

/**
 * Get cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop()?.split(';').shift() || null;
    if (token && token !== 'loggedout') {
      return token;
    }
  }
  return null;
};

/**
 * Get authentication token from localStorage or cookie
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Priority 1: Check localStorage
  const localToken = window.localStorage.getItem("token");
  if (localToken && localToken !== 'null' && localToken !== 'undefined') {
    console.log("✅ Token found in localStorage");
    return localToken;
  }
  
  // Priority 2: Check cookie
  const cookieToken = getCookie("jwt");
  if (cookieToken) {
    console.log("✅ Token found in cookie, syncing to localStorage");
    // Sync to localStorage for consistency
    window.localStorage.setItem("token", cookieToken);
    return cookieToken;
  }
  
  console.warn("⚠️ No valid token found");
  return null;
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  window.localStorage.setItem("token", token);
  console.log("✅ Token saved to localStorage");
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  window.localStorage.removeItem("token");
  console.log("🗑️ Token removed from localStorage");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== '';
};

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle unauthorized responses
  if (response.status === 401 || response.status === 403) {
    console.error("❌ Authentication failed, clearing token");
    removeAuthToken();
    
    // Redirect to login after a short delay
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1000);
    }
    
    throw new Error('Authentication failed. Please login again.');
  }

  return response;
};

/**
 * Handle logout
 */
export const logout = async (apiUrl: string): Promise<void> => {
  try {
    const token = getAuthToken();
    
    if (token) {
      // Call logout endpoint
      await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage and redirect
    removeAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }
};
// src/utils/authCheck.ts
// Import this in your admin pages to verify authentication

export const checkAuth = (): string | null => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No token found in localStorage');
    console.log('👉 Please login at /admin/login');
    return null;
  }

  // Decode and check expiration
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid token format');
      localStorage.removeItem('token');
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;

    if (payload.exp < now) {
      console.error('❌ Token expired at:', new Date(payload.exp * 1000).toLocaleString());
      localStorage.removeItem('token');
      return null;
    }

    console.log('✅ Token valid until:', new Date(payload.exp * 1000).toLocaleString());
    return token;
  } catch (error) {
    console.error('❌ Failed to decode token:', error);
    localStorage.removeItem('token');
    return null;
  }
};

export const getAuthHeaders = () => {
  const token = checkAuth();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
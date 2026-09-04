export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.gomytruck.com/api/v1";

let getAuthToken = null;
let setAuthToken = null;

// Function to inject token getter/setter from AuthProvider to avoid circular dependency
export const setupApiClient = (getTokenFn, setTokenFn) => {
  getAuthToken = getTokenFn;
  setAuthToken = setTokenFn;
};

export const apiClient = async (endpoint, options = {}) => {
  // Always retrieve token directly from getter or fallback to localStorage immediately
  const token = (getAuthToken && getAuthToken()) || (typeof window !== 'undefined' ? localStorage.getItem('vahan_access_token') : null);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  let response = await fetch(url, config);

  // If 401 Unauthorized when a token was sent, clear corrupted/expired session
  if (response.status === 401 && token) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vahan_access_token');
      localStorage.removeItem('vahan_user');
      window.dispatchEvent(new Event("auth_changed"));
    }
    if (setAuthToken) {
      setAuthToken(null);
    }
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return response;
};

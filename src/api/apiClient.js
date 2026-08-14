export const API_BASE_URL = "https://api-test.gomytruck.com/api/v1";

let getAuthToken = null;
let setAuthToken = null;

// Function to inject token getter/setter from AuthProvider to avoid circular dependency
export const setupApiClient = (getTokenFn, setTokenFn) => {
  getAuthToken = getTokenFn;
  setAuthToken = setTokenFn;
};

export const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken ? getAuthToken() : null;

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

  // If 401 Unauthorized, we could attempt a token refresh here if we had a refresh token in cookies
  // Currently, the backend expects the access token in Bearer header.
  if (response.status === 401) {
    // Optionally trigger a re-auth or logout here
    if (setAuthToken) {
      setAuthToken(null);
    }
    // We could emit a custom event to force the LoginModal to open if needed
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return response;
};

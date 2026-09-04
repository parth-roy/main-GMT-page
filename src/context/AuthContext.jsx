import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setupApiClient, apiClient } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vahan_user');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [accessToken, setAccessToken] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('vahan_access_token') : null);
  
  // A queue of callbacks waiting for authentication
  const [authCallback, setAuthCallback] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const fetchUser = useCallback(async (token) => {
    try {
      const res = await apiClient('/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser((prev) => {
            const merged = {
              ...(prev || {}),
              ...json.data,
              name: json.data.name || prev?.name,
              email: json.data.email || prev?.email,
            };
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('vahan_user', JSON.stringify(merged));
              } catch (e) {}
            }
            return merged;
          });
          return json.data;
        }
      }
    } catch (error) {
      console.warn('Notice: Background user profile refresh skipped:', error?.message);
    }
    return null;
  }, []);

  useEffect(() => {
    // Inject getter and setter into apiClient first
    setupApiClient(
      () => typeof window !== 'undefined' ? localStorage.getItem('vahan_access_token') : null,
      (token) => {
        if (typeof window !== 'undefined') {
          if (!token) {
            localStorage.removeItem('vahan_access_token');
            localStorage.removeItem('vahan_user');
            setAccessToken(null);
            setUser(null);
          } else {
            localStorage.setItem('vahan_access_token', token);
            setAccessToken(token);
            fetchUser(token);
          }
        }
        window.dispatchEvent(new Event("auth_changed"));
      }
    );

    const handleAuthChange = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('vahan_access_token');
        const savedUser = localStorage.getItem('vahan_user');
        setAccessToken(token);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {}
        } else if (!token) {
          setUser(null);
        }
        if (token) {
          fetchUser(token);
        }
      }
    };

    window.addEventListener("auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    
    // Background validation if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vahan_access_token');
      if (token) {
        fetchUser(token);
      }
    }

    return () => {
      window.removeEventListener("auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [fetchUser]);

  const login = async (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vahan_access_token', token);
      if (userData) {
        try {
          localStorage.setItem('vahan_user', JSON.stringify(userData));
        } catch (e) {}
      }
      window.dispatchEvent(new Event("auth_changed"));
    }
    
    // Attempt background sync with /auth/me to refresh profile relations
    try {
      const res = await apiClient('/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const finalUser = {
            ...(userData || {}),
            ...json.data,
            name: json.data.name || userData?.name,
            email: json.data.email || userData?.email,
          };
          setUser(finalUser);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('vahan_user', JSON.stringify(finalUser));
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      // Keep userData
    }
    
    // Resume execution of pending action
    if (authCallback) {
      authCallback(token, userData);
      setAuthCallback(null);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vahan_access_token');
      localStorage.removeItem('vahan_user');
      window.dispatchEvent(new Event("auth_changed"));
    }
  };

  /**
   * Procedural hook to demand authentication before an action.
   * If logged in, fires callback immediately.
   * If not logged in, opens the login modal and fires callback upon success.
   */
  const requireAuth = (callback) => {
    if (accessToken && user) {
      callback(accessToken, user);
    } else if (accessToken && !user) {
      // Edge case: token exists but user is still fetching
      fetchUser(accessToken).then(fetchedUser => {
        if (fetchedUser) {
          callback(accessToken, fetchedUser);
        } else {
          setAuthCallback(() => callback);
          setIsLoginModalOpen(true);
        }
      });
    } else {
      setAuthCallback(() => callback);
      setIsLoginModalOpen(true);
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setAuthCallback(null); // Clear pending action on cancel
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, requireAuth, isLoginModalOpen, setIsLoginModalOpen, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

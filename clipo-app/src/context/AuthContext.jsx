import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import api from '../utils/api';

const AuthContext = createContext(null);
const STORAGE_KEYS = {
  token: 'clipo_token',
  user: 'clipo_user'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const tokenResult = await Preferences.get({ key: STORAGE_KEYS.token });
        const userResult = await Preferences.get({ key: STORAGE_KEYS.user });
        const storedToken = tokenResult?.value || localStorage.getItem(STORAGE_KEYS.token);
        const storedUser = userResult?.value || localStorage.getItem(STORAGE_KEYS.user);

        if (storedToken) {
          setToken(storedToken);
          localStorage.setItem(STORAGE_KEYS.token, storedToken);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          localStorage.setItem(STORAGE_KEYS.user, storedUser);
        }
      } catch (err) {
        console.error('[AuthContext] loadStoredAuth failed', err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(STORAGE_KEYS.token, userToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));

    try {
      await Preferences.set({ key: STORAGE_KEYS.token, value: userToken });
      await Preferences.set({ key: STORAGE_KEYS.user, value: JSON.stringify(userData) });
    } catch (err) {
      console.error('[AuthContext] Preferences set failed', err);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);

    try {
      await Preferences.remove({ key: STORAGE_KEYS.token });
      await Preferences.remove({ key: STORAGE_KEYS.user });
    } catch (err) {
      console.error('[AuthContext] Preferences remove failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;

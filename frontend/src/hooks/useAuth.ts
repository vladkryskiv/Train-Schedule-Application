import { useCallback, useState } from 'react';

const TOKEN_KEY = 'accessToken';

export function useAuth() {
 
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem(TOKEN_KEY);
  });

  const handleLogin = useCallback((accessToken: string) => {
    window.localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
  }, []);

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: !!token,
    handleLogin,
    handleLogout,
  };
}

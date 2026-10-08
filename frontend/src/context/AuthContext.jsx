import { useCallback, useEffect, useState } from 'react';
import { AUTH_EXPIRED_EVENT } from '../lib/api/client';
import { getCurrentUser, logoutUser } from '../lib/api/penny-wise';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((data) => {
        if (!isMounted) return;
        setAuth(data?.user ? { user: data.user } : null);
      })
      .catch(() => {
        if (isMounted) setAuth(null);
      })
      .finally(() => {
        if (isMounted) setReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => setAuth(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const signIn = useCallback(async (value) => {
    let user = value?.user ?? value;

    if (!user) {
      try {
        user = (await getCurrentUser())?.user;
      } catch {
        user = null;
      }
    }

    setAuth(user ? { user } : null);
    return user ?? null;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      return;
    } finally {
      setAuth(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

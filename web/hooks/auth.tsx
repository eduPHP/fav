import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import Cookie from 'universal-cookie';
import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: AuthUser;
}

interface AuthContextInterface {
  user: AuthUser;
  signIn(credentials: SignInCredentials): Promise<AuthState>;
  signOut(): void;
  setToken(auth: AuthState): void;
}
const Auth = createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  useEffect(() => {
    ;(async () => {
      const cookie = new Cookie();
      const token = cookie.get<string>('@edu/rss-reader:token');
      const user = cookie.get<AuthUser>('@edu/rss-reader:user');

      if (token && user) {
        setData({
          token,
          user,
        });
        api.defaults.headers['Authorization'] = `Bearer ${token}`
      }
    })()
  }, []);

  const setToken = useCallback(async ({ user, token }): Promise<void> => {
    const cookie = new Cookie();
    cookie.set('@edu/rss-reader:token', token, { secure: false });
    cookie.set('@edu/rss-reader:user', user, { secure: false });

    setData({
      token,
      user,
    });
  }, []);

  const signIn = useCallback(
    async ({ email, password }): Promise<AuthState> => {
      const response = await api.post<AuthState>('auth/login', { email, password });
      await setToken(response.data);
      return response.data
    },
    [setToken],
  );

  const signOut = useCallback(() => {
    const cookie = new Cookie();
    cookie.remove('@edu/rss-reader:token');
    cookie.remove('@edu/rss-reader:user');
    setData({} as AuthState);
  }, []);

  return (
    <Auth.Provider value={{ user: data.user, signIn, signOut, setToken }}>
      {children}
    </Auth.Provider>
  );
};

interface AuthConfig {
  redirectTo?: string
}

export function useAuth(config: AuthConfig = {}): AuthContextInterface {
  const context = useContext(Auth)

  if (!context.user && config.redirectTo) {
    try {
      Router.push(config.redirectTo)
    } catch {
      //
    }
  }

  return context;
}

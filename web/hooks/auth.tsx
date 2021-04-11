import React, { createContext, useCallback, useContext, useState } from 'react';
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
  signIn(credentials: SignInCredentials): void;
  signOut(): void;
  setToken(auth: AuthState): void;
}
const Auth = createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@goBarber:token');
    const user = localStorage.getItem('@goBarber:user');

    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });

  const setToken = useCallback(async ({ user, token }): Promise<void> => {
    localStorage.setItem('@goBarber:token', token);
    localStorage.setItem('@goBarber:user', JSON.stringify(user));

    setData({
      token,
      user,
    });
  }, []);

  const signIn = useCallback(
    async ({ email, password }): Promise<void> => {
      const response = await api.post('sessions', { email, password });
      await setToken(response.data);
    },
    [setToken],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@goBarber:token');
    localStorage.removeItem('@goBarber:user');
    setData({} as AuthState);
  }, []);

  return (
    <Auth.Provider value={{ user: data.user, signIn, signOut, setToken }}>
      {children}
    </Auth.Provider>
  );
};

export function useAuth(): AuthContextInterface {
  const ctx = useContext(Auth);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
}

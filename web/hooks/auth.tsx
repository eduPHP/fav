import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Router from 'next/router';
import Cookie from 'universal-cookie';
import api from '../services/api';
import nextCookie from 'next-cookies';

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
  authenticated: boolean;
  user: AuthUser;

  signIn(credentials: SignInCredentials): Promise<AuthState>;

  signOut(): void;

  setToken(auth: AuthState): void;
}

const Auth = createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  useEffect(() => {
    (async () => {
      const cookie = new Cookie();
      const token = cookie.get<string>('@edu/rss-reader:token');
      const user = cookie.get<AuthUser>('@edu/rss-reader:user');

      if (token && user) {
        setData({
          token,
          user,
        });
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
      }
    })();
  }, []);

  const setToken = useCallback(async ({ user, token }): Promise<void> => {
    const cookie = new Cookie();
    cookie.set('@edu/rss-reader:token', token, { secure: false });
    cookie.set('@edu/rss-reader:user', user, { secure: false });

    api.defaults.headers['Authorization'] = 'Bearer ' + token;
    setData({
      token,
      user,
    });
  }, []);

  const signIn = useCallback(
    async ({ email, password }): Promise<AuthState> => {
      const response = await api.post<AuthState>('auth/login', {
        email,
        password,
      });
      await setToken(response.data);
      return response.data;
    },
    [setToken],
  );

  const signOut = useCallback(() => {
    const cookie = new Cookie();
    cookie.remove('@edu/rss-reader:token');
    cookie.remove('@edu/rss-reader:user');
    setData({} as AuthState);
    delete api.defaults.headers['Authorization'];
  }, []);

  return (
    <Auth.Provider
      value={{
        authenticated: !!data.user,
        user: data.user,
        signIn,
        signOut,
        setToken,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

interface AuthConfig {
  redirectTo?: string;
}

export const authenticated = ctx => {
  const cookies = nextCookie(ctx);
  const token = cookies['@edu/rss-reader:token'];

  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return {};
  }

  if (!token) {
    Router.push('/login');
  }

  return { token };
};

export function useAuth(config: AuthConfig = {}): AuthContextInterface {
  const context = useContext(Auth);

  if (!context.user && config.redirectTo) {
    try {
      Router.push(config.redirectTo);
    } catch {
      //
    }
  }

  return context;
}

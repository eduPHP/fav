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

const cookie = new Cookie();

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  name: string;
  email: string;
}

export interface AuthState {
  token: string;
  user: AuthUser;
}

interface AuthContextInterface {
  authenticated: boolean;
  user: AuthUser;

  signIn(credentials: SignInCredentials): Promise<AuthState>;

  signUp(credentials: SignUpCredentials): Promise<AuthState>;

  updateUser(credentials: SignUpCredentials, token: string): Promise<void>;

  signOut(): void;

  setToken(auth: AuthState): void;
}

const Auth = createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  useEffect(() => {
    (async () => {
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
    cookie.set('@edu/rss-reader:token', token, {
      secure: process.env.NODE_ENV === 'production',
    });
    cookie.set('@edu/rss-reader:user', user, {
      secure: process.env.NODE_ENV === 'production',
    });

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

  const updateUser = useCallback(
    async ({ name, email }: AuthUser, token: string) => {
      await setToken({
        token: data.token,
        user: { email, name },
      });
    },
    [setToken, data],
  );

  const signUp = useCallback(
    async ({ name, email, password }): Promise<AuthState> => {
      const response = await api.post<AuthState>('auth/register', {
        name,
        email,
        password,
      });
      await setToken(response.data);
      return response.data;
    },
    [setToken],
  );

  const signOut = useCallback(async () => {
    cookie.remove('@edu/rss-reader:token', { path: '/' });
    cookie.remove('@edu/rss-reader:user', { path: '/' });
    setData({} as AuthState);
    delete api.defaults.headers['Authorization'];
  }, []);

  return (
    <Auth.Provider
      value={{
        authenticated: !!data.user,
        user: data.user,
        signIn,
        signUp,
        signOut,
        updateUser,
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

export const authenticated = (ctx, options = {}) => {
  const cookies = nextCookie(ctx);
  const token = cookies['@edu/rss-reader:token'];
  const config = {
    redirectTo: '/login',
    redirect: true,
    ...options,
  };

  if (config.redirect && ctx.req && !token) {
    ctx.res.writeHead(302, { Location: config.redirectTo });
    ctx.res.end();
    return {};
  }

  if (!token && config.redirect) {
    Router.push(config.redirectTo);
  }

  // Needs to be here somehow...
  api.defaults.headers['Authorization'] = `Bearer ${token}`;

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

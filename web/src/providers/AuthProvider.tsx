import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchProfile, login as loginRequest, register as registerRequest } from '@/api/auth';
import { setAuthToken } from '@/api/client';
import type { AuthResponse, AuthUser, Role } from '@/types';

const STORAGE_KEY = 'ht-auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  initializing: boolean;
  status: 'idle' | 'loading';
  error?: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    role: Role;
    athleteId?: string;
    athleteDisplayName?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const writeStorage = (data: Pick<AuthState, 'token' | 'user'>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const readStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Pick<AuthState, 'token' | 'user'>;
  } catch {
    return null;
  }
};

const applyAuthResponse = (response: AuthResponse): Pick<AuthState, 'token' | 'user'> => ({
  token: response.token,
  user: response.user,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    initializing: true,
    status: 'idle',
    error: null,
  });

  useEffect(() => {
    const cached = readStorage();
    if (!cached?.token) {
      setState((prev) => ({ ...prev, initializing: false }));
      return;
    }

    setAuthToken(cached.token);
    fetchProfile()
      .then((profile) => {
        const next = { token: cached.token, user: profile.user };
        writeStorage(next);
        setState({
          token: cached.token,
          user: profile.user,
          initializing: false,
          status: 'idle',
          error: null,
        });
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
        setState({ token: null, user: null, initializing: false, status: 'idle', error: null });
      });
  }, []);

  const setAuth = useCallback((auth: Pick<AuthState, 'token' | 'user'>) => {
    setAuthToken(auth.token);
    writeStorage(auth);
    setState({
      token: auth.token,
      user: auth.user,
      initializing: false,
      status: 'idle',
      error: null,
    });
  }, []);

  const login = useCallback<AuthContextValue['login']>(async (email, password) => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    try {
      const response = await loginRequest(email, password);
      setAuth(applyAuthResponse(response));
    } catch (error) {
      const message = (error as Error).message ?? 'Unable to login';
      setState((prev) => ({ ...prev, status: 'idle', error: message }));
      throw error;
    }
  }, [setAuth]);

  const register = useCallback<AuthContextValue['register']>(async (payload) => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    try {
      const response = await registerRequest(payload);
      setAuth(applyAuthResponse(response));
    } catch (error) {
      const message = (error as Error).message ?? 'Unable to register';
      setState((prev) => ({ ...prev, status: 'idle', error: message }));
      throw error;
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setState({
      token: null,
      user: null,
      initializing: false,
      status: 'idle',
      error: null,
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.token) return;
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    try {
      const profile = await fetchProfile();
      const next = { token: state.token, user: profile.user };
      writeStorage(next);
      setState({
        token: state.token,
        user: profile.user,
        initializing: false,
        status: 'idle',
        error: null,
      });
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout, state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [state, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

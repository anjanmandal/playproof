import { unwrap, apiClient } from './client';
import type { AuthResponse } from '@/types';

export const login = (email: string, password: string) =>
  unwrap(
    apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    }),
  );

export const register = (payload: {
  email: string;
  password: string;
  role: 'ATHLETE' | 'COACH' | 'AT_PT' | 'PARENT' | 'ADMIN';
  athleteId?: string;
  athleteDisplayName?: string;
  teams?: string[];
}) => unwrap(apiClient.post<AuthResponse>('/auth/register', payload));

export const fetchProfile = () => unwrap(apiClient.get<{ user: AuthResponse['user'] }>('/auth/me'));

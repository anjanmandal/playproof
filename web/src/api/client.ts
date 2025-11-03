import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    const headers = (config.headers ?? {}) as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${authToken}`;
    config.headers = headers;
  } else if (config.headers) {
    delete (config.headers as AxiosRequestHeaders).Authorization;
  }

  return config;
});

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const unwrap = <T>(promise: Promise<{ data: T }>): Promise<T> =>
  promise.then((response) => response.data);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      throw new ApiError(
        typeof data === 'object' && data?.error ? data.error : error.message,
        status,
        data,
      );
    }

    throw new ApiError(error.message);
  },
);

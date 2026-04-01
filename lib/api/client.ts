import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from '../types/api';
import { API_BASE_URL } from './config';

const TOKEN_KEY = '@rebank_auth_tokens';

// ── Token management ────────────────────────────────────

export async function getTokens(): Promise<AuthTokens | null> {
  try {
    const json = await AsyncStorage.getItem(TOKEN_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ── API error ───────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

function formatApiError(data: any, status: number): ApiError {
  if (typeof data === 'string') {
    return { message: data, status };
  }
  if (data?.message) {
    return { message: data.message, status };
  }
  // Validation errors: { field: ["error"] }
  const fields = Object.entries(data || {});
  if (fields.length > 0) {
    const firstMessage = (fields[0][1] as string[])?.[0] || 'Request failed';
    return { message: firstMessage, status, errors: data };
  }
  return { message: 'An unexpected error occurred', status };
}

// ── HTTP client ─────────────────────────────────────────

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: Record<string, any>;
  multipart?: FormData;
  auth?: boolean;
}

async function request<T = any>(options: RequestOptions): Promise<T> {
  const { method, path, body, multipart, auth = true } = options;

  const headers: Record<string, string> = {};

  if (auth) {
    const tokens = await getTokens();
    if (tokens) {
      headers['Authorization'] = `Bearer ${tokens.access_token}`;
    }
  }

  let fetchBody: string | FormData | undefined;

  if (multipart) {
    fetchBody = multipart;
    // Let fetch set Content-Type with boundary for multipart
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: fetchBody,
  });

  // Handle token refresh on 401
  if (response.status === 401 && auth) {
    const tokens = await getTokens();
    if (tokens?.refresh_token) {
      const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh_token }),
      });

      if (refreshRes.ok) {
        const { access } = await refreshRes.json();
        await saveTokens({ access_token: access, refresh_token: tokens.refresh_token });

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${access}`;
        response = await fetch(`${API_BASE_URL}${path}`, {
          method,
          headers,
          body: fetchBody,
        });
      } else {
        await clearTokens();
        throw { message: 'Session expired. Please log in again.', status: 401 } as ApiError;
      }
    } else {
      throw { message: 'Authentication required.', status: 401 } as ApiError;
    }
  }

  // Parse response
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw formatApiError(data, response.status);
  }

  return data as T;
}

// ── Public API ──────────────────────────────────────────

export const api = {
  get<T = any>(path: string, auth = true) {
    return request<T>({ method: 'GET', path, auth });
  },

  post<T = any>(path: string, body?: Record<string, any>, auth = true) {
    return request<T>({ method: 'POST', path, body, auth });
  },

  put<T = any>(path: string, body?: Record<string, any>, auth = true) {
    return request<T>({ method: 'PUT', path, body, auth });
  },

  upload<T = any>(path: string, formData: FormData, auth = true) {
    return request<T>({ method: 'POST', path, multipart: formData, auth });
  },

  uploadPut<T = any>(path: string, formData: FormData, auth = true) {
    return request<T>({ method: 'PUT', path, multipart: formData, auth });
  },
};

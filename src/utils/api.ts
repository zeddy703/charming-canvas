// src/utils/api.ts
import { triggerSessionExpired } from '@/components/SessionExpiredDialog';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface ApiOptions {
  method: HttpMethod;
  body?: Record<string, any> | FormData;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  showErrorToast?: boolean; // Optional: auto-show toast on error
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function apiRequest<T = any>(
  path: string,
  {
    method,
    body,
    headers = {},
    credentials = 'include',
    showErrorToast = true,
  }: ApiOptions
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  const config: RequestInit = {
    method,
    credentials,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
      delete config.headers['Content-Type'];
    } else {
      config.body = JSON.stringify(body);
    }
  }

  let response: Response;

  try {
    response = await fetch(url, config);
  } catch (err) {
    // Network error (no connection, CORS, timeout, etc.)
    const message = 'Network error. Please check your connection.';
    if (showErrorToast) {
      const { toast } = await import('@/components/ui/use-toast');
      toast({
        title: 'Connection Failed',
        description: message,
        variant: 'destructive',
      });
    }
    throw new ApiError(message, 0);
  }

  let data: any;

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  console.log('data response -', data)

  try {
    data = isJson ? await response.json() : await response.text();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    // Handle 401 Unauthorized - session expired
    if (response.status === 401) {
      triggerSessionExpired();
      throw new ApiError('Session expired', 401, data);
    }

    const message =
      data?.message ||
      data?.error || `An unexpected error occurred. Please try again.`;

    if (showErrorToast) {
      const { toast } = await import('@/components/ui/use-toast');
      toast({
        title: 'Request Failed',
        description: message,
        variant: 'destructive',
      });
      return;
    }

    throw new ApiError(message, response.status, data);
  }

  // Success: return parsed data or empty object
  return (data ?? {}) as T;
}

export default apiRequest;
export { ApiError };
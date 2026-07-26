export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(data?.message || 'An API error occurred');
    this.status = status;
    this.data = data;
  }
}

/**
 * Centralized fetch helper for the frontend.
 * Currently, it assumes the user is always authenticated (for the developer only).
 * If a real backend is connected, an Authorization header can be easily added here.
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
    // 'Authorization': `Bearer ${token}` // Easy to add later
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body: any, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

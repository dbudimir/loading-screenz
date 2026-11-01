// Common types used across the application

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  error?: string;
};

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

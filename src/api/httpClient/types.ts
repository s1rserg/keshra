import type { InternalAxiosRequestConfig } from 'axios';

export interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

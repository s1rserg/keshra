import type { SignInLocalDto, SignUpLocalDto } from './types';

import type { AxiosRequestConfig } from 'axios';

class AuthApiService {
  public signUp(data: SignUpLocalDto): AxiosRequestConfig {
    return {
      method: 'POST',
      url: '/auth/sign-up',
      data,
    };
  }

  public signIn(data: SignInLocalDto): AxiosRequestConfig {
    return {
      method: 'POST',
      url: '/auth/sign-in',
      data,
    };
  }

  public signOut(): AxiosRequestConfig {
    return {
      method: 'GET',
      url: '/auth/sign-out',
    };
  }

  public refresh(): AxiosRequestConfig {
    return {
      method: 'GET',
      url: '/auth/refresh',
      withCredentials: true,
    };
  }
}

export const authApiService = new AuthApiService();

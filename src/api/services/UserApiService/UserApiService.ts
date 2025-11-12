import type { AxiosRequestConfig } from 'axios';

class UserApiService {
  public fetchUser(): AxiosRequestConfig {
    return {
      method: 'GET',
      url: '/users/me',
    };
  }
}

export const userApiService = new UserApiService();

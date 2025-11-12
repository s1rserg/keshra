import type { Nullable } from 'types/utils';

class LocalStorageService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';

  public getAccessToken(): Nullable<string> {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public setAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  public deleteAccessToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}

export const localStorageService = new LocalStorageService();

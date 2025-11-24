import type { AxiosRequestConfig } from 'axios';
import type { CreateReactionDto } from './types';

class ReactionApiService {
  public create(data: CreateReactionDto): AxiosRequestConfig {
    return {
      method: 'POST',
      url: '/reactions',
      data,
    };
  }

  public delete(messageId: number): AxiosRequestConfig {
    return {
      method: 'DELETE',
      url: `/reactions/${messageId}`,
    };
  }
}

export const reactionApiService = new ReactionApiService();

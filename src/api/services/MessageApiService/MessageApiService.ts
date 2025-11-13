import type { AxiosRequestConfig } from 'axios';
import type { GetMessagesQueryDto, CreateMessageDto } from './types';

class MessageApiService {
  public findAllByChatId(params: GetMessagesQueryDto): AxiosRequestConfig {
    return {
      method: 'GET',
      url: '/messages',
      params,
    };
  }

  public create(data: CreateMessageDto): AxiosRequestConfig {
    return {
      method: 'POST',
      url: '/messages',
      data,
    };
  }
}

export const messageApiService = new MessageApiService();

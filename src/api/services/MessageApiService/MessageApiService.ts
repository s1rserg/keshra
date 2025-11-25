import type { AxiosRequestConfig } from 'axios';
import type { GetMessagesQueryDto, CreateMessageDto, UpdateMessageDto } from './types';

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

  public update(id: number, data: UpdateMessageDto): AxiosRequestConfig {
    return {
      method: 'PATCH',
      url: `/messages/${id}`,
      data,
    };
  }

  public delete(id: number): AxiosRequestConfig {
    return {
      method: 'DELETE',
      url: `/messages/${id}`,
    };
  }
}

export const messageApiService = new MessageApiService();

import type { CreatePrivateChatDto, CreatePublicChatDto } from './types';
import type { AxiosRequestConfig } from 'axios';

class ChatApiService {
  public findMy(): AxiosRequestConfig {
    return {
      method: 'GET',
      url: '/chats',
    };
  }

  public createPublic(data: CreatePublicChatDto): AxiosRequestConfig {
    return {
      method: 'POST',
      url: '/chats/public',
      data,
    };
  }

  public createPrivate(data: CreatePrivateChatDto): AxiosRequestConfig {
    return {
      method: 'POST',
      url: '/chats/private',
      data,
    };
  }

  public getById(id: number): AxiosRequestConfig {
    return {
      method: 'GET',
      url: `/chats/${id}`,
    };
  }
}

export const chatApiService = new ChatApiService();

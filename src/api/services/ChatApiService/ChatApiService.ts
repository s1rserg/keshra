import type { CreatePrivateChatDto, CreatePublicChatDto, GetPublicChatsQueryDto } from './types';
import type { AxiosRequestConfig } from 'axios';

class ChatApiService {
  public findMy(): AxiosRequestConfig {
    return {
      method: 'GET',
      url: '/chats',
    };
  }

  public findPublic(params: GetPublicChatsQueryDto): AxiosRequestConfig {
    return {
      method: 'GET',
      url: '/chats/public',
      params,
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

  public joinPublic(id: number): AxiosRequestConfig {
    return {
      method: 'POST',
      url: `/chats/${id}/join`,
    };
  }
}

export const chatApiService = new ChatApiService();

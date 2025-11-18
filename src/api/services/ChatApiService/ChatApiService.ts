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

  public uploadAvatar(id: number, file: File): AxiosRequestConfig {
    const formData = new FormData();
    formData.append('file', file);

    return {
      method: 'POST',
      url: `/chats/${id}/avatars`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  public getAllAvatars(id: number, signal?: AbortSignal): AxiosRequestConfig {
    return {
      method: 'GET',
      url: `/chats/${id}/avatars`,
      signal,
    };
  }

  public setMainAvatar(id: number, mediaId: number): AxiosRequestConfig {
    return {
      method: 'PATCH',
      url: `/chats/${id}/avatars/${mediaId}/set-main`,
    };
  }

  public deleteAvatar(id: number, mediaId: number): AxiosRequestConfig {
    return {
      method: 'DELETE',
      url: `/chats/${id}/avatars/${mediaId}`,
    };
  }
}

export const chatApiService = new ChatApiService();

import { useQuery } from '@tanstack/react-query';
import { httpClient, userApiService, QueryKeys, type User } from 'api';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { localStorageService } from 'utils/LocalStorageService';

export const useGetUser = () => {
  const location = useLocation();

  const fetchUser = useCallback(async () => {
    const response = await httpClient<User>(userApiService.fetchUser());
    return response.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return useQuery({
    queryKey: [...QueryKeys.user],
    queryFn: fetchUser,
    enabled: !!localStorageService.getAccessToken(),
  });
};

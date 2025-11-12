export const ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
};

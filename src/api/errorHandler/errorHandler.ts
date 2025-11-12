import { toast } from 'react-toastify';
import axios, { isAxiosError } from 'axios';
import { i18next } from 'config/i18n';

export const handleApiError = (error: unknown, showToast = true) => {
  if (!showToast) return;

  if (axios.isCancel(error)) {
    return;
  }

  if (!isAxiosError(error)) {
    toast.error(i18next.t('unknownError'));
    return;
  }

  if (error.response?.status === 401) {
    toast.error(i18next.t('sessionExpired'));
    return;
  }

  const message = (error.response?.data as { message?: string })?.message;
  toast.error(message || i18next.t('genericApiError'));
};

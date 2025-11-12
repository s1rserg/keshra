import Backend, { type HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector, { type DetectorOptions } from 'i18next-browser-languagedetector';
import i18next, { type ReactOptions } from 'i18next';

import { initReactI18next } from 'react-i18next';
import { SupportedLanguages } from './types';
import { APP_LANGUAGE_STORAGE_KEY } from './config';

void i18next
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init<HttpBackendOptions & DetectorOptions & ReactOptions>({
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: `/locales/{{ns}}/{{ns}}.{{lng}}.json`,
    },
    debug: false,

    lng: localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) || SupportedLanguages.ENGLISH,
    fallbackLng: SupportedLanguages.ENGLISH,
    supportedLngs: [SupportedLanguages.ENGLISH, SupportedLanguages.UKRAINIAN],

    returnEmptyString: false,
    returnNull: false,
    ns: ['common', 'header', 'loginPage', 'registerPage'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'cookie'],
      lookupLocalStorage: APP_LANGUAGE_STORAGE_KEY,
      caches: ['localStorage', 'cookie'],
    },
  });

export { i18next };

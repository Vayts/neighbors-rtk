import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import uk from './locales/uk.json';

const language = localStorage.getItem('neighbors_lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translations: en },
    uk: { translations: uk },
  },
  fallbackLng: ['en', 'uk'],
  lng: language,
  debug: false,
  ns: ['translations'],
  defaultNS: 'translations',
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
});

export default i18n;

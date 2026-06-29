import { createI18n } from 'vue-i18n';
import en from './en.json';
import es from './es.json';

type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], 'en' | 'es'>({
  legacy: false, // Use Composition API
  globalInjection: true, // Inject $t globally
  locale: navigator.language.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
});

export default i18n;

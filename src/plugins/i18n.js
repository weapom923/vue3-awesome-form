import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    greeting: 'Hello, World!',
    description: 'Vue 3 + Vuetify 4 + vue-i18n demo',
    switchLang: 'Switch to Japanese',
  },
  ja: {
    greeting: 'こんにちは、世界！',
    description: 'Vue 3 + Vuetify 4 + vue-i18n デモ',
    switchLang: '英語に切り替え',
  },
}

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

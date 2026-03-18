import { createI18n } from 'vue-i18n';

const commonMessageEn = {
  '送信': 'Submit',
};
type CommonMessageKey = keyof typeof commonMessageEn;
const commonMessageJa = Object.fromEntries(Object.keys(commonMessageEn).map(k => [k, k])) as Record<CommonMessageKey, string>;
export const commonMessages = {
  ja: commonMessageJa,
  en: commonMessageEn,
} as const;

export default createI18n({
  legacy: false,
  locale: 'ja',
  fallbackLocale: 'ja',
});

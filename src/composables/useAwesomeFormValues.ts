import { computed, reactive, ref, watch, type Ref } from 'vue';
import {
  TEXT_FIELD_VALUE_MAX_LENGTH,
  TEXT_FIELD_VALUE_MIN_LENGTH,
  TextFieldValue,
  type TextFieldInputValue,
} from '@/entities/text-field-value';
import {
  NUMBER_INPUT_VALUE_MAX_NUMBER,
  NUMBER_INPUT_VALUE_MIN_NUMBER,
  NumberInputValue,
  type NumberInputInputValue,
} from '@/entities/number-input-value';
import { AutocompleteValue, AUTOCOMPLETE_VALUE_ITEMS, type AutocompleteInputValue } from '@/entities/autocomplete-value';
import {
  SLIDER_VALUE_MAX_NUMBER,
  SLIDER_VALUE_MULTIPLE_OF,
  SliderValue,
  type SliderInputValue,
} from '@/entities/slider-value';
import {
  RANGE_SLIDER_DIFFERENCE_TOO_SMALL_ISSUE_MESSAGE,
  RANGE_SLIDER_VALUE_MIN_DIFFERENCE,
  RangeSliderValue,
  type RangeSliderInputValue,
} from '@/entities/range-slider-value';
import { FileInputValue, type FileInputInputValue } from '@/entities/file-input-value';
import {
  OTP_INPUT_VALUE_DIGITS,
  OtpInputValue,
  type OtpInputInputValue,
} from '@/entities/otp-input-value';
import {
  RATING_VALUE_MIN_NUMBER,
  RatingValue,
  type RatingInputValue,
} from '@/entities/rating-value';
import { ValidFormValue } from '@/entities/valid-form-value';
import { validationRule } from '@/utils/validationUtils';
import { useI18n } from 'vue-i18n';

export type { ValidFormValue } from '@/entities/valid-form-value';

/**
 * このコンポーザブルで使用する i18n メッセージ。
 *
 * 日本語文字列をそのままキーとして使用するパターンを採用している。
 * - `messageEn` のキーが日本語文字列、値が英語訳となる
 * - `messageJa` は同じキーに対して日本語文字列をそのまま値として返す（キー = 値）
 * - フォールバックロケールを `'ja'` に設定しているため、
 *   未翻訳キーが存在しても日本語が自然にフォールバック表示される
 *
 * このパターンの利点：
 * - 日本語環境での開発時に `t('入力は必須です')` と書けばそのまま表示されるため可読性が高い
 * - 英語訳の追加・修正が `messageEn` だけで完結する
 */
const messageEn = {
  '入力内容が不正です': 'Invalid input',
  '入力は必須です': 'Input is required',
  '{min}〜{max}文字で入力してください': 'Please enter between {min} and {max} characters',
  '{max}文字以下で入力してください': 'Please enter no more than {max} characters',
  '{min}〜{max}の数値を入力してください': 'Please enter a number between {min} and {max}',
  '{items}の中から選択してください': 'Please select from {items}',
  '{min}以上の値を入力してください': 'Please enter a value greater than or equal to {min}',
  '{max}以下の値を入力してください': 'Please enter a value less than or equal to {max}',
  '{max}以下の値を{multipleOf}の倍数で入力してください': 'Please enter a multiple of {multipleOf} up to {max}',
  '{multipleOf}の倍数を入力してください': 'Please enter a multiple of {multipleOf}',
  '2つの数値を選び、差を{minDifference}以上にしてください': 'Please choose two numbers with a difference of at least {minDifference}',
  'ファイルを1つ選択してください': 'Please select one file',
  '数値を入力してください': 'Please enter a number',
  'ファイルを選択してください': 'Please select a file',
  '{digits}桁の数字を入力してください': 'Please enter a {digits}-digit number',
  '{min}以上の評価を入力してください': 'Please enter a rating of {min} or higher',
} as const;
type MessageKey = keyof typeof messageEn;
const messageJa = Object.fromEntries(Object.keys(messageEn).map(k => [k, k])) as Record<MessageKey, string>;

/**
 * AwesomeForm の各フィールドの入力値と Vuetify コンポーネント向け props を管理するコンポーザブル。
 *
 * 各フィールドは `[fieldName]Value`（`v-model` 用）と `[fieldName]Props`（`v-bind` 用）のペアで返される。
 * テンプレートでは以下のように使用する：
 * ```html
 * <VTextField v-model="textFieldValue" v-bind="textFieldProps" />
 * ```
 *
 * フォーム全体の入力値を Zod で検証し、バリデーション通過時は `validFormValue` に
 * 型安全な値を書き込む。バリデーション失敗時は `undefined` を書き込む。
 * `VForm` の `v-model`（Vuetify が管理するバリデーション状態）と Zod による検証は独立しているため、
 * 送信可否の判定には両方の確認が推奨される。
 *
 * @param validFormValue - バリデーション済みのフォーム値を書き込む Ref。
 *   Zod によるパース成功時のみ型安全な値が格納され、失敗時は `undefined` となる。
 */
export const useAwesomeFormValues = (
  validFormValue: Ref<ValidFormValue | undefined>
) => {
  const { t } = useI18n({
    messages: {
      ja: messageJa,
      en: messageEn,
    },
  });

  const textFieldValue = ref<TextFieldInputValue | undefined>(validFormValue.value?.textFieldValue);
  const numberInputValue = ref<NumberInputInputValue | undefined>(validFormValue.value?.numberInputValue);
  const autocompleteValue = ref<AutocompleteInputValue | undefined>(validFormValue.value?.autocompleteValue);
  const sliderValue = ref<SliderInputValue | undefined>(validFormValue.value?.sliderValue);
  const rangeSliderValue = ref<RangeSliderInputValue | undefined>(validFormValue.value?.rangeSliderValue);
  const fileInputValue = ref<FileInputInputValue | undefined>(validFormValue.value?.fileInputValue);
  const otpInputValue = ref<OtpInputInputValue | undefined>(validFormValue.value?.otpInputValue);
  const ratingValue = ref<RatingInputValue | undefined>(validFormValue.value?.ratingValue);

  const textFieldProps = reactive({
    hint: computed(() => t('{min}〜{max}文字で入力してください', {
      min: TEXT_FIELD_VALUE_MIN_LENGTH,
      max: TEXT_FIELD_VALUE_MAX_LENGTH,
    })),
    rules: [
      validationRule(TextFieldValue.schema, {
        required: () => t('入力は必須です'),
        tooBig: ({ max }) => t('{max}文字以下で入力してください', { max }),
      }),
    ],
  });

  const numberInputProps = reactive({
    hint: computed(() => t('{min}〜{max}の数値を入力してください', {
      min: NUMBER_INPUT_VALUE_MIN_NUMBER,
      max: NUMBER_INPUT_VALUE_MAX_NUMBER,
    })),
    rules: [
      validationRule(NumberInputValue.schema, {
        required: () => t('入力は必須です'),
        invalidType: () => t('数値を入力してください'),
        tooSmall: ({ min }) => t('{min}以上の値を入力してください', { min }),
        tooBig: ({ max }) => t('{max}以下の値を入力してください', { max }),
      }),
    ],
  });

  const autocompleteProps = reactive({
    hint: computed(() => t('{items}の中から選択してください', { items: AUTOCOMPLETE_VALUE_ITEMS.join(', ') })),
    items: AUTOCOMPLETE_VALUE_ITEMS,
    rules: [
      validationRule(AutocompleteValue.schema, {
        required: () => t('入力は必須です'),
        invalidType: () => t('{items}の中から選択してください', { items: AUTOCOMPLETE_VALUE_ITEMS.join(', ') }),
      }),
    ],
  });

  const sliderProps = reactive({
    hint: computed(() => t('{max}以下の値を{multipleOf}の倍数で入力してください', {
      max: SLIDER_VALUE_MAX_NUMBER,
      multipleOf: SLIDER_VALUE_MULTIPLE_OF,
    })),
    rules: [
      validationRule(SliderValue.schema, {
        required: () => t('入力は必須です'),
        invalidType: () => t('数値を入力してください'),
        tooBig: ({ max }) => t('{max}以下の値を入力してください', { max }),
        notMultipleOf: ({ multipleOf }) => t('{multipleOf}の倍数を入力してください', { multipleOf }),
      }),
    ],
  });

  const rangeSliderProps = reactive({
    hint: computed(() => t('2つの数値を選び、差を{minDifference}以上にしてください', {
      minDifference: RANGE_SLIDER_VALUE_MIN_DIFFERENCE,
    })),
    rules: [
      validationRule(RangeSliderValue.schema, {
        required: () => t('入力は必須です'),
        invalidType: () => t('数値を入力してください'),
        custom: ({ issue }) => {
          if (issue.message === RANGE_SLIDER_DIFFERENCE_TOO_SMALL_ISSUE_MESSAGE) {
            return t('2つの数値を選び、差を{minDifference}以上にしてください', {
              minDifference: RANGE_SLIDER_VALUE_MIN_DIFFERENCE,
            });
          }
          return undefined;
        },
      }),
    ],
  });

  const fileInputProps = reactive({
    hint: computed(() => t('ファイルを1つ選択してください')),
    rules: [
      validationRule(FileInputValue.schema, {
        required: () => t('ファイルを選択してください'),
        invalidType: () => t('入力内容が不正です'),
      }),
    ],
  });

  const otpInputProps = reactive({
    hint: computed(() => t('{digits}桁の数字を入力してください', {
      digits: OTP_INPUT_VALUE_DIGITS,
    })),
    rules: [
      validationRule(OtpInputValue.schema, {
        required: () => t('入力は必須です'),
        invalidType: () => t('{digits}桁の数字を入力してください', { digits: OTP_INPUT_VALUE_DIGITS }),
      }),
    ],
  });

  const ratingProps = reactive({
    hint: computed(() => t('{min}以上の評価を入力してください', {
      min: RATING_VALUE_MIN_NUMBER,
    })),
    rules: [
      validationRule(RatingValue.schema, {
        fallbackToZodMessage: true,
      }),
    ],
  });

  const validatedFormValue = computed(() =>
    ValidFormValue.schema.safeParse({
      textFieldValue: textFieldValue.value,
      numberInputValue: numberInputValue.value,
      autocompleteValue: autocompleteValue.value,
      sliderValue: sliderValue.value,
      rangeSliderValue: rangeSliderValue.value,
      fileInputValue: fileInputValue.value,
      otpInputValue: otpInputValue.value,
      ratingValue: ratingValue.value,
    }).data
  );

  watch(validatedFormValue, (value) => validFormValue.value = value);

  return {
    textFieldValue,
    textFieldProps,
    numberInputValue,
    numberInputProps,
    autocompleteValue,
    autocompleteProps,
    sliderValue,
    sliderProps,
    rangeSliderValue,
    rangeSliderProps,
    fileInputValue,
    fileInputProps,
    otpInputValue,
    otpInputProps,
    ratingValue,
    ratingProps,
  };
};

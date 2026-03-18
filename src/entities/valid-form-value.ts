import { z } from 'zod';
import { TextFieldValue } from '@/entities/text-field-value';
import { NumberInputValue } from '@/entities/number-input-value';
import { AutocompleteValue } from '@/entities/autocomplete-value';
import { SliderValue } from '@/entities/slider-value';
import { RangeSliderValue } from '@/entities/range-slider-value';
import { FileInputValue } from '@/entities/file-input-value';
import { OtpInputValue } from '@/entities/otp-input-value';
import { RatingValue } from '@/entities/rating-value';

/**
 * フォーム全体のバリデーション済みの値を表すエンティティ。
 *
 * 各フィールドのエンティティスキーマを `z.object` で合成し、
 * フォーム全体が valid かどうかを単一の `safeParse` で判定できる。
 *
 * `ValidFormValue` 型（= `z.infer<...>`）は送信ペイロードの型として使用し、
 * この型を持つ値はすべてのフィールドが Zod のスキーマを通過していることが保証される。
 */
export const ValidFormValue = {
  schema: z.object({
    textFieldValue: TextFieldValue.schema,
    numberInputValue: NumberInputValue.schema,
    autocompleteValue: AutocompleteValue.schema,
    sliderValue: SliderValue.schema,
    rangeSliderValue: RangeSliderValue.schema,
    fileInputValue: FileInputValue.schema,
    otpInputValue: OtpInputValue.schema,
    ratingValue: RatingValue.schema,
  }),
};
export type ValidFormValue = z.infer<typeof ValidFormValue.schema>;

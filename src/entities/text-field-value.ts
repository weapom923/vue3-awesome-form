import { z } from 'zod';

export const TEXT_FIELD_VALUE_MIN_LENGTH = 1;
export const TEXT_FIELD_VALUE_MAX_LENGTH = 5;

export const TextFieldValue = {
  schema: z.string().min(TEXT_FIELD_VALUE_MIN_LENGTH).max(TEXT_FIELD_VALUE_MAX_LENGTH),
};
export type TextFieldInputValue = z.input<typeof TextFieldValue.schema>;
export type TextFieldValue = z.infer<typeof TextFieldValue.schema>;

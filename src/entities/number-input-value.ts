import { z } from 'zod';

export const NUMBER_INPUT_VALUE_MIN_NUMBER = -100;
export const NUMBER_INPUT_VALUE_MAX_NUMBER = 100;

export const NumberInputValue = {
  schema: z.number().min(NUMBER_INPUT_VALUE_MIN_NUMBER).max(NUMBER_INPUT_VALUE_MAX_NUMBER),
};
export type NumberInputInputValue = z.input<typeof NumberInputValue.schema>;
export type NumberInputValue = z.infer<typeof NumberInputValue.schema>;

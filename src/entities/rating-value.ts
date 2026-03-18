import { z } from 'zod';

export const RATING_VALUE_MIN_NUMBER = 2;

export const RatingValue = {
  schema: z.number().min(RATING_VALUE_MIN_NUMBER),
};
export type RatingInputValue = z.input<typeof RatingValue.schema>;
export type RatingValue = z.infer<typeof RatingValue.schema>;

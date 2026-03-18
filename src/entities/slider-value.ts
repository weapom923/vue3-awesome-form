import { z } from 'zod';

export const SLIDER_VALUE_MAX_NUMBER = 50;
export const SLIDER_VALUE_MULTIPLE_OF = 5;

export const SliderValue = {
  schema: z.number().max(SLIDER_VALUE_MAX_NUMBER).multipleOf(SLIDER_VALUE_MULTIPLE_OF),
};
export type SliderInputValue = z.input<typeof SliderValue.schema>;
export type SliderValue = z.infer<typeof SliderValue.schema>;

import { z } from 'zod';

export const RANGE_SLIDER_VALUE_MIN_DIFFERENCE = 10;
export const RANGE_SLIDER_DIFFERENCE_TOO_SMALL_ISSUE_MESSAGE = 'range_slider_difference_too_small';

export const RangeSliderValue = {
  schema: z
    .tuple([z.number(), z.number()])
    .superRefine(([start, end], ctx) => {
      if (Math.abs(end - start) < RANGE_SLIDER_VALUE_MIN_DIFFERENCE) {
        ctx.addIssue({
          code: 'custom',
          message: RANGE_SLIDER_DIFFERENCE_TOO_SMALL_ISSUE_MESSAGE,
        });
      }
    }),
};
export type RangeSliderInputValue = z.input<typeof RangeSliderValue.schema>;
export type RangeSliderValue = z.infer<typeof RangeSliderValue.schema>;

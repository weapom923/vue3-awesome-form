import { z } from 'zod';

export const AUTOCOMPLETE_VALUE_ITEMS = ['Apple', 'Banana', 'Cherry', 'Durian'] as const;

export const AutocompleteValue = {
  schema: z.enum(AUTOCOMPLETE_VALUE_ITEMS),
};
export type AutocompleteInputValue = z.input<typeof AutocompleteValue.schema>;
export type AutocompleteValue = z.infer<typeof AutocompleteValue.schema>;

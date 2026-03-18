import { z } from 'zod';

export const FileInputValue = {
  schema: z.instanceof(File),
};
export type FileInputInputValue = z.input<typeof FileInputValue.schema>;
export type FileInputValue = z.infer<typeof FileInputValue.schema>;

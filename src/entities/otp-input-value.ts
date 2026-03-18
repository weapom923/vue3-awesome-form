import { z } from 'zod';

export const OTP_INPUT_VALUE_DIGITS = 6;
export const OTP_INPUT_VALUE_REGEX = new RegExp(`^[0-9]{${OTP_INPUT_VALUE_DIGITS}}$`);

export const OtpInputValue = {
  schema: z.string().regex(OTP_INPUT_VALUE_REGEX),
};
export type OtpInputInputValue = z.input<typeof OtpInputValue.schema>;
export type OtpInputValue = z.infer<typeof OtpInputValue.schema>;

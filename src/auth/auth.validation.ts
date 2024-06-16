import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly CREATE: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  static readonly VERIFY_EMAIL: ZodType = z.object({
    token: z.string(),
  });

  static readonly FORGOT_PASSWORD: ZodType = z.object({
    email: z.string().email(),
  });

  static readonly RESET_PASSWORD: ZodType = z.object({
    token: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  });
}

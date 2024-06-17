import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly CREATE_USER_BIO: ZodType = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1).optional(),
    phone_number: z.string().min(12),
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    country: z.string().min(1),
  });
}

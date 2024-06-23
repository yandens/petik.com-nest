import { z, ZodType } from 'zod';
import { HttpException, Injectable, PipeTransform } from '@nestjs/common';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

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

  static readonly UPDATE_USER_BIO: ZodType = z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    phone_number: z.string().min(12).optional(),
    street: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    province: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
  });
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File): any {
    if (!value) throw new HttpException('File is required', 400);

    if (value.size > MAX_FILE_SIZE)
      throw new HttpException('File size is too big, max 5MB', 400);

    if (!ALLOWED_MIME_TYPES.includes(value.mimetype))
      throw new HttpException(
        'File type is not allowed, allowed types are: png, jpeg, jpg',
        400,
      );

    return value;
  }
}

import ShortUniqueId from 'short-unique-id';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomUuidUtil {
  generateRandomId(): string {
    const { randomUUID } = new ShortUniqueId({ length: 5 });
    return randomUUID();
  }

  generateRandomString(): string {
    const { randomUUID } = new ShortUniqueId({ length: 15 });
    return randomUUID();
  }
}

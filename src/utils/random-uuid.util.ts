import ShortUniqueId from 'short-unique-id';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomUuidUtil {
  private shortUniqueId: ShortUniqueId;

  constructor() {
    this.shortUniqueId = new ShortUniqueId({ length: 5 });
  }

  generateRandomId(): string {
    return this.shortUniqueId.randomUUID();
  }
}

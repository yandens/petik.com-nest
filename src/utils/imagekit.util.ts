import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

@Injectable()
export class ImagekitUtil {
  private imagekit: ImageKit;

  constructor(private configService: ConfigService) {
    this.imagekit = new ImageKit({
      publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
      privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const response = await this.imagekit.upload({
      file: file.buffer.toString('base64'),
      fileName: file.originalname,
      useUniqueFileName: true,
      folder,
    });

    return response.url;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const url = imageUrl.split('/').pop();
    await this.imagekit.deleteFile(url);
  }
}

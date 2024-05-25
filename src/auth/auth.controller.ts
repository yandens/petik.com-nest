import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../model/auth.model';
import { WebResponse } from '../model/web.model';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(@Body() request: RegisterRequest): Promise<WebResponse<any>> {
    await this.authService.register(request);
    return {
      data: 'OK',
    };
  }
}

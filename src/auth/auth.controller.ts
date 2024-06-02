import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../model/auth.model';
import { WebResponse } from '../model/web.model';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(201)
  async register(@Body() request: RegisterRequest): Promise<WebResponse<any>> {
    await this.authService.register(request);
    return {
      data: 'OK',
    };
  }

  @Get('/verify/:token')
  @HttpCode(200)
  async verify(@Param('token') token: string): Promise<WebResponse<any>> {
    const response = await this.authService.verifyEmail(token);
    return {
      data: response,
    };
  }
}

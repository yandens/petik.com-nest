import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '../model/auth.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/auth')
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
    const request: VerifyEmailRequest = { token };
    const response = await this.authService.verifyEmail(request);
    return {
      data: response,
    };
  }

  @Post('/sign-in')
  @HttpCode(200)
  async login(@Body() request: LoginRequest): Promise<WebResponse<any>> {
    const response = await this.authService.login(request);
    return {
      data: response,
    };
  }

  @Post('/forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body() request: ForgotPasswordRequest,
  ): Promise<WebResponse<any>> {
    await this.authService.forgotPassword(request);
    return {
      data: 'OK',
    };
  }

  @Post('/reset-password/:token')
  @HttpCode(200)
  async resetPassword(
    @Param('token') token: string,
    @Body() request: ResetPasswordRequest,
  ): Promise<WebResponse<any>> {
    request.token = token;
    await this.authService.resetPassword(request);
    return {
      data: 'OK',
    };
  }
}

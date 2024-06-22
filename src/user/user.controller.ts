import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserBioRequest,
  UpdateUserBioRequest,
  UserBioResponse,
} from '../model/user.model';
import { Auth } from '../common/decorator/auth.decorator';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  async createUserBio(
    @Auth() user: User,
    @Body() request: CreateUserBioRequest,
  ): Promise<WebResponse<UserBioResponse>> {
    const result = await this.userService.createUserBio(user, request);
    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getUserBio(@Auth() user: User): Promise<WebResponse<UserBioResponse>> {
    const result = await this.userService.getUserBio(user);
    return {
      data: result,
    };
  }

  @Patch()
  @HttpCode(200)
  async updateUserBio(
    @Auth() user: User,
    @Body() request: UpdateUserBioRequest,
  ): Promise<WebResponse<UserBioResponse>> {
    const result = await this.userService.updateUserBio(user, request);
    return {
      data: result,
    };
  }
}

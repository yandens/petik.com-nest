import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserBioRequest, UserBioResponse } from '../model/user.model';
import { Auth } from '../auth/auth.decorator';
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
}

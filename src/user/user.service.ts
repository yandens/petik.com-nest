import { ConfigService } from '@nestjs/config';
import { ValidationService } from '../common/service/validation.service';
import { PrismaService } from '../common/service/prisma.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '@prisma/client';
import {
  CreateUserBioRequest,
  toUserBioResponse,
  UpdateUserBioRequest,
  UserBioResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import { RandomUuidUtil } from '../utils/random-uuid.util';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private randomUuidUtil: RandomUuidUtil,
  ) {}

  async getUserById(id: string, includeQuery?: any): Promise<any> {
    // log the request
    this.logger.info(`Get user by id ${id}`);

    // get user by id
    return this.prismaService.user.findUnique({
      where: { id },
      include: includeQuery,
    });
  }

  async getUserByEmail(email: string, includeQuery?: any): Promise<any> {
    // log the request
    this.logger.info(`Get user by email ${email}`);

    // get user by email
    return this.prismaService.user.findFirst({
      where: { email },
      include: includeQuery,
    });
  }

  async getUsers(size?: number, page?: number): Promise<User[]> {
    // log the request
    this.logger.info(`Get users with size ${size} and page ${page}`);

    // get users
    return this.prismaService.user.findMany({ take: size, skip: page });
  }

  async createUser(data: any): Promise<User> {
    // log the request
    this.logger.info(`Create user with data ${JSON.stringify(data)}`);

    // create user
    return this.prismaService.user.create({ data });
  }

  async updateUser(id: string, data: any): Promise<User> {
    // log the request
    this.logger.info(
      `Update user with id ${id} and data ${JSON.stringify(data)}`,
    );

    // update user
    return this.prismaService.user.update({ where: { id }, data });
  }

  async createUserBio(
    user: User,
    request: CreateUserBioRequest,
  ): Promise<UserBioResponse> {
    // log the request
    this.logger.info(`Create user bio with data ${JSON.stringify(request)}`);

    // validate the request
    const createRequest: CreateUserBioRequest = this.validationService.validate(
      UserValidation.CREATE_USER_BIO,
      request,
    );

    // check user if exists
    const userRecord = await this.getUserById(user.id);
    if (!userRecord) throw new HttpException('User not found', 404);

    // check if user bio exists
    const userBioRecord = await this.prismaService.userBiodata.findFirst({
      where: { user_id: user.id },
    });
    if (userBioRecord) throw new HttpException('User bio already exists', 400);

    // create user bio
    const data = {
      ...createRequest,
      user_id: user.id,
      id: this.randomUuidUtil.generateRandomId(),
    };
    const userBio = await this.prismaService.userBiodata.create({ data });

    return toUserBioResponse(userBio);
  }

  async getUserBio(user: User): Promise<UserBioResponse> {
    // log the request
    this.logger.info(`Get user bio by user id ${user.id}`);

    // get user bio
    const userBio = await this.prismaService.userBiodata.findFirst({
      where: { user_id: user.id },
    });
    if (!userBio) throw new HttpException('User bio not found', 404);

    return toUserBioResponse(userBio);
  }

  async updateUserBio(
    user: User,
    request: UpdateUserBioRequest,
  ): Promise<UserBioResponse> {
    // log the request
    this.logger.info(
      `Update user bio by user id ${user.id} with data ${JSON.stringify(request)}`,
    );

    // validate the request
    const updateRequest: UpdateUserBioRequest = this.validationService.validate(
      UserValidation.CREATE_USER_BIO,
      request,
    );

    // check user bio if exists
    await this.getUserBio(user);

    // update user bio
    const userBio = await this.prismaService.userBiodata.update({
      where: { user_id: user.id },
      data: updateRequest,
    });

    return toUserBioResponse(userBio);
  }
}

import { ConfigService } from '@nestjs/config';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async getUserById(id: string) {
    // log the request
    this.logger.info(`Get user by id ${id}`);

    // get user by id
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string) {
    // log the request
    this.logger.info(`Get user by email ${email}`);

    // get user by email
    return this.prismaService.user.findFirst({
      where: { email },
    });
  }

  async getUsers(size?: number, page?: number) {
    // log the request
    this.logger.info(`Get users with size ${size} and page ${page}`);

    // get users
    return this.prismaService.user.findMany({
      take: size,
      skip: page,
    });
  }

  async createUser(data: any) {
    // log the request
    this.logger.info(`Create user with data ${JSON.stringify(data)}`);

    // create user
    return this.prismaService.user.create({
      data,
    });
  }

  async updateUser(id: string, data: any) {
    // log the request
    this.logger.info(
      `Update user with id ${id} and data ${JSON.stringify(data)}`,
    );

    // update user
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }
}

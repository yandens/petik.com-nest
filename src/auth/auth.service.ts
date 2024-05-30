import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RegisterRequest } from '../model/auth.model';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { RandomUuidHelper } from '../common/random-uuid.helper';
import { EmailHelper } from '../common/email.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private randomUuidHelper: RandomUuidHelper,
    private emailHelper: EmailHelper,
  ) {}

  async register(request: RegisterRequest) {
    // log the request
    this.logger.info(`Register user with request ${JSON.stringify(request)}`);

    // validate the request
    const registerRequest: RegisterRequest = this.validationService.validate(
      AuthValidation.CREATE,
      request,
    );

    // check same email
    const totalSameEmail = await this.prismaService.user.count({
      where: { email: registerRequest.email },
    });
    if (totalSameEmail !== 0)
      throw new HttpException('Email already exist', 400);

    // check password and confirm password -> must be same
    if (registerRequest.password !== registerRequest.confirmPassword)
      throw new HttpException('Password and confirm password is not same', 400);

    // hash the password
    const encryptedPassword = await bcrypt.hash(registerRequest.password, 10);

    // get user role id
    const role = await this.prismaService.role.findFirst({
      where: { name: 'USER' },
    });

    // insert the user data into database
    const user = await this.prismaService.user.create({
      data: {
        id: this.randomUuidHelper.generateRandomId(),
        role_id: role.id,
        email: registerRequest.email,
        password: encryptedPassword,
        is_verified: false,
        is_active: true,
        account_type: 'BASIC',
      },
    });

    // send email to registered user for verify email
    const verifyLink = `${this.configService.get('APP_LINK')}/auth/verify/${this.randomUuidHelper.generateRandomString()}`;
    await this.emailHelper.sendEmail(
      user,
      'Verify Email',
      './verify-email',
      verifyLink,
    );
  }
}

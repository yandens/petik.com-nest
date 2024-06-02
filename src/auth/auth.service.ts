import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RegisterRequest } from '../model/auth.model';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { RandomUuidUtil } from '../utils/random-uuid.util';
import { EmailUtil } from '../utils/email.util';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private jwtService: JwtService,
    private randomUuidUtil: RandomUuidUtil,
    private emailUtil: EmailUtil,
  ) {}

  /**
   * This method is used to register a new user.
   *
   * @async
   * @param {RegisterRequest} request - The request object containing user registration details.
   * @throws {HttpException} - Throws an exception if the email already exists or if the password and confirm password do not match.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  async register(request: RegisterRequest): Promise<void> {
    // log the request
    this.logger.info(`Register user with request ${JSON.stringify(request)}`);

    // validate the request
    const registerRequest: RegisterRequest = this.validationService.validate(
      AuthValidation.CREATE,
      request,
    );

    // check if user with same email already exist
    const sameEmail = await this.userService.getUserByEmail(
      registerRequest.email,
    );
    if (sameEmail) throw new HttpException('Email already exist', 400);

    // check password and confirm password is match
    if (registerRequest.password !== registerRequest.confirmPassword)
      throw new HttpException('Password and confirm password is not same', 400);

    // hash the password
    const encryptedPassword = await bcrypt.hash(registerRequest.password, 10);

    // get role id for 'USER' role
    const role = await this.prismaService.role.findFirst({
      where: { name: 'USER' },
    });

    // insert the user data into database
    const data = {
      id: this.randomUuidUtil.generateRandomId(),
      role_id: role.id,
      email: registerRequest.email,
      password: encryptedPassword,
      is_verified: false,
      is_active: true,
      account_type: 'BASIC',
    };
    const user = await this.userService.createUser(data);

    // generate token
    const token = this.jwtService.sign({
      id: user.id,
      role: role.name,
      email: user.email,
    });

    // send email to registered user for verify email
    const verifyLink = `${this.configService.get('APP_LINK')}/auth/verify/${token}`;
    await this.emailUtil.sendEmail(
      user,
      'Verify Email',
      './verify-email',
      verifyLink,
    );
  }

  /**
   * This method is used to verify a user's email.
   *
   * @async
   * @param {string} token - The JWT token sent to the user's email.
   * @throws {HttpException} - Throws an exception if the token is invalid or if the user is not found.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  async verifyEmail(token: string): Promise<string> {
    // verify the token
    const payload = this.jwtService.verify(token);
    if (!payload) throw new HttpException('Invalid token', 400);

    // get user by id include with role
    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new HttpException('User not found', 404);

    // check if user is already verified
    if (user.is_verified) throw new HttpException('User already verified', 400);

    // update user is_verified status
    await this.userService.updateUser(user.id, { is_verified: true });

    // generate new token and return it
    return this.jwtService.sign({
      id: payload.id,
      role: payload.role,
      email: payload.email,
    });
  }
}

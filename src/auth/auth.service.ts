import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/service/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '../model/auth.model';
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

    // insert the user data into database
    const data = {
      id: this.randomUuidUtil.generateRandomId(),
      email: registerRequest.email,
      password: encryptedPassword,
    };
    const user = await this.userService.createUser(data);

    // generate token
    const token = this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      { expiresIn: '300s' },
    );

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
   * @param {VerifyEmailRequest} request - The request object containing user verify email details.
   * @throws {HttpException} - Throws an exception if the token is invalid or if the user is not found.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<string> {
    // log the request
    this.logger.info(`Verify email with request ${JSON.stringify(request)}`);

    // validate the request
    const verifyEmailRequest: VerifyEmailRequest =
      this.validationService.validate(AuthValidation.VERIFY_EMAIL, request);

    // verify the token
    const payload = this.jwtService.verify(verifyEmailRequest.token);
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
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  /**
   * This method is used to authenticate a user.
   *
   * @async
   * @param {LoginRequest} request - The request object containing user login details.
   * @throws {HttpException} - Throws an exception if the email or password is wrong, if the user is not verified, or if the user is registered with OAuth.
   * @returns {Promise<string>} - Returns a promise that resolves to a JWT token.
   */
  async login(request: LoginRequest): Promise<string> {
    // log the request
    this.logger.info(`Login user with request ${JSON.stringify(request)}`);

    // validate the request
    const loginRequest: LoginRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    // get user by email
    const user = await this.userService.getUserByEmail(loginRequest.email);
    if (!user) throw new HttpException('Email or password is wrong', 400);

    // check if user is verified
    if (!user.is_verified)
      throw new HttpException('Please do the email verification first', 400);

    // check if user is register with basic way
    if (user.account_type.toLowerCase() !== 'basic')
      throw new HttpException(
        'You have an account with OAuth way, please login using that',
        400,
      );

    // compare password
    const isPasswordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );
    if (!isPasswordMatch)
      throw new HttpException('Email or password is wrong', 400);

    // generate token and return it
    return this.jwtService.sign({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  /**
   * This method is used to handle the forgot password request.
   *
   * @async
   * @param {ForgotPasswordRequest} request - The request object containing user forgot password details.
   * @throws {HttpException} - Throws an exception if the email is not found.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    // log the request
    this.logger.info(`Forgot password with request ${JSON.stringify(request)}`);

    // validate the request
    const forgotPasswordRequest: ForgotPasswordRequest =
      this.validationService.validate(AuthValidation.FORGOT_PASSWORD, request);

    // get user by email
    const user = await this.userService.getUserByEmail(
      forgotPasswordRequest.email,
    );
    if (!user) throw new HttpException('Email not found', 404);

    // generate token
    const token = this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      { expiresIn: '300s' },
    );

    // send email to user for reset password
    const resetLink = `${this.configService.get('APP_LINK')}/auth/reset-password/${token}`;
    await this.emailUtil.sendEmail(
      user,
      'Reset Password',
      './reset-password',
      resetLink,
    );
  }

  /**
   * This method is used to handle the forgot password request.
   *
   * @async
   * @param {ResetPasswordRequest} request - The request object containing user reset password details.
   * @throws {HttpException} - Throws an exception if the email is not found.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    // log the request
    this.logger.info(`Reset password with request ${JSON.stringify(request)}`);

    // validate the request
    const resetPasswordRequest: ResetPasswordRequest =
      this.validationService.validate(AuthValidation.RESET_PASSWORD, request);

    // verify the token
    const payload = this.jwtService.verify(resetPasswordRequest.token);
    if (!payload) throw new HttpException('Invalid token', 400);

    // check if password and confirm password is match
    if (resetPasswordRequest.password !== resetPasswordRequest.confirmPassword)
      throw new HttpException('Password and confirm password is not same', 400);

    // get user by id
    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new HttpException('User not found', 404);

    // hash the password
    const encryptedPassword = await bcrypt.hash(
      resetPasswordRequest.password,
      10,
    );

    // update the user password
    await this.userService.updateUser(user.id, { password: encryptedPassword });
  }
}

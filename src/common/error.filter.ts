import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Catch(HttpException, ZodError, JsonWebTokenError, TokenExpiredError)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: exception.errors,
      });
    } else if (
      exception instanceof JsonWebTokenError ||
      exception instanceof TokenExpiredError
    ) {
      response.status(401).json({
        errors: exception.message,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}

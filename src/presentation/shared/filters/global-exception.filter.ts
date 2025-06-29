import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { DomainException } from '../../../domain/exceptions/domain.exception';

/**
 * Global exception filter that handles and transforms all exceptions into a consistent format.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    // Handle different types of exceptions
    if (exception instanceof UserAlreadyExistsException) {
      // Specific domain exception - map to appropriate HTTP status
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof DomainException) {
      // Generic domain exception - map to bad request by default
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      // NestJS HTTP exceptions already have status code and response structure
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message[0]
          : String(exceptionResponse.message);
      } else {
        message = exception.message;
      }
    } else {
      // Unknown exceptions - treat as internal server error
      this.logger.error(
        `Unhandled exception: ${
          exception instanceof Error 
            ? `${exception.message}\n${exception.stack}` 
            : String(exception)
        }`,
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // Return consistent error response format
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from 'src/shared/logger/logger.service';
import { extractStackTrace } from 'src/shared/utils/extract-stack-trace';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly loggerService: LoggerService) {
    super();
    this.loggerService.contextName = LocalAuthGuard.name;
  }
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { url } = request;
    const { body } = request;
    if (err || !user) {
      const exception = {
        exception: err?.message,
        status: err?.response?.statusCode,
        stackTrace: extractStackTrace(err.stack),
      };
      this.loggerService.error(`[${url}] User ${body?.email} ${JSON.stringify(exception)}`)
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
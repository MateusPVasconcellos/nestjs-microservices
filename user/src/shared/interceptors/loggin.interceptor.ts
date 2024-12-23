import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { catchError, tap } from 'rxjs/operators';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly loggerService: LoggerService) {
        this.loggerService.contextName = LoggingInterceptor.name;
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();
        return next
            .handle()
            .pipe(
                catchError((error) => {
                    this.loggerService.contextName = error?.response?.context;
                    const endTime = Date.now();
                    const elapsedTime = endTime - startTime;
                    const formattedStartTime = new Date(startTime).toLocaleString('pt-BR');
                    const formattedEndTime = new Date(endTime).toLocaleString('pt-BR');
                    const exception = {
                        error,
                        stackTrace: this.extractStackTrace(error.stack),
                    };
                    this.loggerService.error(`Start: ${formattedStartTime}, End: ${formattedEndTime}, Elapsed: ${elapsedTime}ms ${JSON.stringify(exception)}`);
                    return throwError(() => error);
                }),
                tap({
                    next: () => {
                        const endTime = Date.now();
                        const elapsedTime = endTime - startTime;

                        const formattedStartTime = new Date(startTime).toLocaleString('pt-BR');
                        const formattedEndTime = new Date(endTime).toLocaleString('pt-BR');
                        this.loggerService.info(`Start: ${formattedStartTime}, End: ${formattedEndTime}, Elapsed: ${elapsedTime}ms`);
                    },
                }),
            );
    }
    private extractStackTrace(stack: string): string {
        const match = / at (.+)/.exec(stack);
        return match ? match[1] : stack;
    }
}
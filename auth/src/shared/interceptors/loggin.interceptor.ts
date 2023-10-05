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
        const request = context.switchToHttp().getRequest();
        const { url } = request;
        const startTime = Date.now();
        return next
            .handle()
            .pipe(
                catchError((error) => {
                    const endTime = Date.now();
                    const elapsedTime = endTime - startTime;
                    const formattedStartTime = new Date(startTime).toLocaleString('pt-BR');
                    const formattedEndTime = new Date(endTime).toLocaleString('pt-BR');
                    this.loggerService.error(`[${url}] Start: ${formattedStartTime}, End: ${formattedEndTime}, Elapsed: ${elapsedTime}ms`, error.stack);
                    return throwError(() => error);
                }),
                tap({
                    next: () => {
                        const endTime = Date.now();
                        const elapsedTime = endTime - startTime;

                        const formattedStartTime = new Date(startTime).toLocaleString('pt-BR');
                        const formattedEndTime = new Date(endTime).toLocaleString('pt-BR');
                        this.loggerService.info(`[${url}] Start: ${formattedStartTime}, End: ${formattedEndTime}, Elapsed: ${elapsedTime}ms`);
                    },
                }),
            );
    }
}
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly loggerService: LoggerService) {
        this.loggerService.contextName = LoggingInterceptor.name;
    }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { url } = request;

        const startTime = Date.now(); // Captura o tempo inicial

        return next
            .handle()
            .pipe(
                tap(() => {
                    const endTime = Date.now(); // Captura o tempo final
                    const elapsedTime = endTime - startTime;

                    const formattedStartTime = new Date(startTime).toLocaleString('pt-BR');
                    const formattedEndTime = new Date(endTime).toLocaleString('pt-BR');
                    this.loggerService.info(`[${url}] Start: ${formattedStartTime}, End: ${formattedEndTime}, Elapsed: ${elapsedTime}ms`)
                }),
            );
    }
}
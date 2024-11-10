import { createLogger, format, Logger, transports } from 'winston';
import { Injectable, Scope } from '@nestjs/common';

export enum LogLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
    private _idempotencyKey: string;
    private _contextName = 'Default';
    private readonly logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: LogLevel.INFO, // Ajustável se necessário
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }), // Captura stack trace automaticamente
                format.json()
            ),
            transports: [
                new transports.Console({
                    handleExceptions: true,
                    format: format.combine(
                        format.colorize({colors: {info: 'blue', error: 'red', warn: 'yellow'}}), // Coloriza logs no console
                        format.printf((info) => {
                            return `${info.timestamp} [${info.level}] [${info.meta.context}] ${info.message} ${
                                info.meta ? JSON.stringify(info.meta) : ''
                            }`;
                        })
                    ),
                }),
                // Adicione outros transportes, como para arquivo, se necessário
                // new transports.File({ filename: 'application.log' })
            ],
            exitOnError: false,
        });
    }

    set idempotencyKey(idempotencyKey: string) {
        this._idempotencyKey = idempotencyKey;
    }

    get idempotencyKey(): string {
        return this._idempotencyKey;
    }

    set contextName(contextName: string) {
        this._contextName = contextName;
    }

    get contextName(): string {
        return this._contextName;
    }

    error(message: string, stackTrace?: any): void {
        this.logger.log({
            level: LogLevel.ERROR,
            message: message,
            meta: {
                context: this.contextName,
                idempotency: this._idempotencyKey,
                stackTrace,
            },
        });
    }

    warn(message: string): void {
        this.logger.log({
            level: LogLevel.WARN,
            message: message,
            meta: { context: this.contextName, idempotency: this._idempotencyKey },
        });
    }

    info(message: string): void {
        this.logger.log({
            level: LogLevel.INFO,
            message: message,
            meta: { context: this.contextName, idempotency: this._idempotencyKey },
        });
    }
}
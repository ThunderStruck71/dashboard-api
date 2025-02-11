import { Logger, ILogObj } from 'tslog';
import { ILogger } from './logger.interface.js';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
	logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger<ILogObj>({
			hideLogPositionForProduction: true,
		});
	}

	public error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	public log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	public warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}

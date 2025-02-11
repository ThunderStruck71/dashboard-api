import { Logger, ILogObj } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger{
	logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger<ILogObj>({
			hideLogPositionForProduction: true
		});
	}

	public error(...args: unknown[]) {
		this.logger.error(...args);
	}

	public log(...args: unknown[]) {
		this.logger.info(...args);
	}

	public warn(...args: unknown[]) {
		this.logger.warn(...args);
	}
}
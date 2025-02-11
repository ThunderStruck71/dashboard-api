import express, {Express} from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { ILogger } from './logger/logger.interface.js';
import { inject, injectable } from 'inversify';
import { TYPES } from './types.js';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger, 
		@inject(TYPES.UserController) private usersController: UserController, 
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter
	) {
		this.app = express();
		this.port = 8000;
	}

	private useRoutes() {
		this.app.use('/users', this.usersController.router);
	}

	private useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init() {
		this.useRoutes();
		this.useExceptionFilters();

		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
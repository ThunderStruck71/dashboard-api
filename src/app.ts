import express, {Express} from 'express';
import { Server } from 'http';
import { UsersController } from './users/users.controller.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { ILogger } from './logger/logger.interface.js';

export class App {
	app: Express;
	server: Server;
	port: number;
	logger: ILogger;
	usersController: UsersController;
	exceptionFilter: ExceptionFilter;

	constructor(logger: ILogger, usersController: UsersController, exceptionFilter: ExceptionFilter) {
		this.app = express();
		this.port = 8000;
		this.logger = logger;
		this.usersController = usersController;
		this.exceptionFilter = exceptionFilter;
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
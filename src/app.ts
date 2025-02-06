import express, {Express} from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service.js';
import { UsersController } from './users/users.controller.js';

export class App {
	app: Express;
	server: Server;
	port: number;
	logger: LoggerService;
	usersController: UsersController;

	constructor(logger: LoggerService, usersController: UsersController) {
		this.app = express();
		this.port = 8000;
		this.logger = logger;
		this.usersController = usersController;
	}

	private useRoutes() {
		this.app.use('/users', this.usersController.router);
	}

	public async init() {
		this.useRoutes();

		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
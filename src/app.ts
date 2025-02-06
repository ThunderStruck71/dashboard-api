import express, {Express} from 'express';
import { usersRouter } from './users/users.js';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service.js';

export class App {
	app: Express;
	server: Server;
	port: number;
	logger: LoggerService;

	constructor(logger: LoggerService) {
		this.app = express();
		this.port = 8080;
		this.logger = logger;
	}

	private useRoutes() {
		this.app.use('/users', usersRouter);
	}

	public async init() {
		this.useRoutes();

		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
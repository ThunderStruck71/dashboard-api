import express, {Express} from 'express';
import { usersRouter } from './users/users.js';
import { Server } from 'http';

export class App {
	app: Express;
	server: Server;
	port: number;

	constructor() {
		this.app = express();
		this.port = 8080;
	}

	private useRoutes() {
		this.app.use('/users', usersRouter);
	}

	public async init() {
		this.useRoutes();

		this.server = this.app.listen(this.port);
		console.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
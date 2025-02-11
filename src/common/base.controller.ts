import { Response, Router } from 'express';
import { IControllerRoute } from './route.interface.js';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): Response<any, Record<string, any>> {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): void {
		res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}] ${route.path}`);
			const handler = route.func.bind(this);
			this._router[route.method](route.path, handler);
		});
	}
}

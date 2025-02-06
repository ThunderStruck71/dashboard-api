import { Response, Router } from "express";
import { LoggerService } from "../logger/logger.service";
import { IControllerRoute } from "./route.interface";

export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: LoggerService) {
		this._router = Router();
	}

	get() {
		return this._router;
	}

	send<T>(res: Response, statusCode: number, message: string) {
		res.sendStatus(statusCode).json(message);
	}

	ok<T>(res: Response, message: string) {
		this.send<T>(res, 200, message);
	}

	created(res: Response) {
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
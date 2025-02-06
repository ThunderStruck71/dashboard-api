import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller.js";
import { LoggerService } from "../logger/logger.service.js";

export class UsersController extends BaseController {
	constructor(logger: LoggerService) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register
			},
			{
				path: '/login',
				method: 'post',
				func: this.login
			}
		]);
	}

	public login(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'login');
	}

	public register(req: Request, res: Response, next: NextFunction) {
		this.ok(res, 'register');
	}
}
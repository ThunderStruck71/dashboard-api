import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { HttpError } from '../errors/http-error.class.js';
import { IUserController } from './user.controller.interface.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
		]);
	}

	public login(req: Request, res: Response, next: NextFunction): void {
		next(new HttpError(401, 'ошибка авторизации', 'login'));
	}

	public register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'register');
	}
}

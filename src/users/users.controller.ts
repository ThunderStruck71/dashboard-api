import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { ILogger } from '../logger/logger.interface.js';
import 'reflect-metadata';
import { HttpError } from '../errors/http-error.class.js';
import { IUsersController } from './users.controller.interface.js';
import { UserLoginDto } from './dto/user-login.dto.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import { IUsersService } from './users.service.interface.js';
import jsonwebtoken from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface.js';
import { AuthGuard } from '../common/auth.guard.js';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private usersService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	public async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValid = await this.usersService.validateUser(body);

		if (!isValid) {
			return next(new HttpError(401, 'Ошибка авторизации', 'login'));
		}

		const secret = this.configService.get('SECRET');
		const jwt = await this.signJwt(body.email, secret);

		this.ok(res, { access_token: jwt });
	}

	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.createUser(body);

		if (!result) {
			return next(new HttpError(422, 'Такой пользователь уже существует', 'register'));
		}
		this.ok(res, { email: result?.email, id: result.id });
	}

	public async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.usersService.getUserInfo(user);
		this.ok(res, { id: userInfo?.id, email: userInfo?.email });
	}

	private signJwt(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jsonwebtoken.sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}

					resolve(token as string);
				},
			);
		});
	}
}

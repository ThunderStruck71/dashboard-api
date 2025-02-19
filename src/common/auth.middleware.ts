import jsonwebtoken from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface.js';
import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			jsonwebtoken.verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload != 'string') {
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}

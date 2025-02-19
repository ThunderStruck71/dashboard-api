import { Request, Response, NextFunction, Router } from 'express';

export interface IUsersController {
	readonly router: Router;
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
}

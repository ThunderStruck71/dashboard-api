import { Request, Response, NextFunction, Router } from "express";

export interface IUserController {
	readonly router: Router;
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
}
import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { User } from './user.entity.js';
import { IUsersService } from './users.service.interface.js';
import { IConfigService } from '../config/config.service.interface.js';
import { TYPES } from '../types.js';
import { UserModel } from '@prisma/client';
import { IUsersRepository } from './users.repository.interface.js';
import bcryptjs from 'bcryptjs';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(name, email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, +salt);

		const existed = await this.usersRepository.find(email);
		if (existed) {
			return null;
		}

		return await this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existed = await this.usersRepository.find(email);

		if (!existed) {
			return false;
		}

		const user = new User(existed.name, existed.email, existed.password);
		return await user.isCorrectPassword(password);
	}
}

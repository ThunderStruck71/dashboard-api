import 'reflect-metadata';
import { Container } from 'inversify';
import { IUsersService } from './users.service.interface.js';
import { TYPES } from '../types.js';
import { UsersService } from './users.service.js';
import { IUsersRepository } from './users.repository.interface.js';
import { IConfigService } from '../config/config.service.interface.js';
import { User } from './user.entity.js';
import { UserModel } from '@prisma/client';
import { describe, before, test, mock } from 'node:test';
import assert from 'node:assert';

const ConfigServiceMock: IConfigService = {
	get: mock.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: mock.fn(),
	create: mock.fn(),
};

const container = new Container();
let usersService: IUsersService;
let usersRepository: IUsersRepository;
let configService: IConfigService;

let createdUser: UserModel | null;

before(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);

	usersService = container.get<IUsersService>(TYPES.UsersService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	configService = container.get<IConfigService>(TYPES.ConfigService);
});

describe('User service', () => {
	test('Create user', async () => {
		mock.method(configService, 'get').mock.mockImplementationOnce((key: string) => '1');

		mock.method(usersRepository, 'create').mock.mockImplementationOnce(
			async (user: User): Promise<UserModel> => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await usersService.createUser({
			email: 'i@i.ru',
			password: '1',
			name: 'Ivan',
		});

		assert.equal(createdUser?.id, 1);
		assert.notEqual(createdUser?.password, 1);
	});

	test('Validate user with correct password', async () => {
		mock.method(usersRepository, 'find').mock.mockImplementationOnce(async (email) => createdUser);

		const validateUser = await usersService.validateUser({
			email: 'i@i.ru',
			password: '1',
		});

		assert.equal(validateUser, true);
	});

	test('Validate user with wrong password', async () => {
		mock.method(usersRepository, 'find').mock.mockImplementationOnce(async (email) => createdUser);

		const validateUser = await usersService.validateUser({
			email: 'i@i.ru',
			password: '2',
		});

		assert.equal(validateUser, false, 'Incorrect password');
	});

	test('Validate user with missing user', async () => {
		mock.method(usersRepository, 'find').mock.mockImplementationOnce(async (email) => null);

		const validateUser = await usersService.validateUser({
			email: 'i@i.ru',
			password: '1',
		});

		assert.equal(validateUser, false, 'User not found');
	});
});

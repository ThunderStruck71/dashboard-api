import { after, before, describe, it } from 'node:test';
import assert from 'node:assert';
import { boot } from '../src/main.js';
import { App } from '../src/app.js';
import request from 'supertest';

let application: App;

before(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const response = await request(application.app)
			.post('/users/register')
			.send({ email: 'i@i.ru', password: '1' });

		assert.equal(response.statusCode, 422);
	});

	it('Login - success', async () => {
		const response = await request(application.app)
			.post('/users/login')
			.send({ email: 'fcda@md.ru', password: 'zxcvbn' });

		assert.ok(response.body.access_token !== undefined);
	});

	it('Login - unauthorized', async () => {
		const response = await request(application.app)
			.post('/users/login')
			.send({ email: 'fcda@md.ru', password: '1' });

		assert.equal(response.statusCode, 401);
	});

	it('UserInfo - success', async () => {
		const loginResponse = await request(application.app)
			.post('/users/login')
			.send({ email: 'fcda@md.ru', password: 'zxcvbn' });

		const getInfoResponse = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${loginResponse.body.access_token}`);

		assert.equal(getInfoResponse.body.email, 'fcda@md.ru');
	});

	it('UserInfo - unauthorized', async () => {
		const getInfoResponse = await request(application.app)
			.get('/users/info')
			.set('Authorization', 'Bearer 1');

		assert.equal(getInfoResponse.statusCode, 401);
	});
});

after(() => {
	application.close();
});

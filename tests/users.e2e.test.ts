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
});

after(() => {
	application.close();
});

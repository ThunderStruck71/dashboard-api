import bcryptjs from 'bcryptjs';

export class User {
	private _password: string;

	constructor(
		private readonly _name: string,
		private readonly _email: string,
	) {}

	get name(): string {
		return this._name;
	}

	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(password: string): Promise<void> {
		this._password = await bcryptjs.hash(password, 10);
	}
}

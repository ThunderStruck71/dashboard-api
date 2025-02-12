import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { LoggerService } from './logger/logger.service.js';
import { UsersController } from './users/users.controller.js';
import { ILogger } from './logger/logger.interface.js';
import { TYPES } from './types.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';
import { IUsersController } from './users/users.controller.interface.js';
export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<App>(TYPES.Application).to(App);
});

export function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

bootstrap();

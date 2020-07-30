/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { BaseController } from '../base';
import { Application } from '../foundation/application';
import { Router } from '../router';
import { UseMiddlewareOption } from '../decorators/use/interface';

export class ControllerService {
  /**
   * application instance
   */
  app: Application;

  /**
   * Create Controller Service
   * @param app 
   */
  constructor(app: Application) {
    this.app = app;
  }

  /**
   * register a controller
   */
  public register(controller: typeof BaseController) {
    if (Reflect.getMetadata('type', controller) !== 'controller') return this;
    this.resolve(controller);
    return this;
  }

  /**
   * resolve this controller
   */
  public resolve(controller: typeof BaseController) {
    const routes = Reflect.getMetadata('routes', controller) || {};
    const prefixs = Reflect.getMetadata('prefixs', controller) || [''];
    // const controllerMiddlewares = Reflect.getMetadata('controllerMiddlewares', controller) || [];
    // const routeMiddlewares = Reflect.getMetadata('routeMiddlewares', controller) || {};

    for (const prefix of prefixs) {
      this.registerRoutes(controller, routes, prefix);
    }
  }

  /**
   * register controller routes
   */
  private registerRoutes(controller: any, routes: any, prefix = '') {
    const router = this.app.get<Router>('router');
    const controllerMiddlewareOptions: UseMiddlewareOption[] = Reflect.getMetadata('use-middlewares', controller) ?? [];
    for (const key of Object.keys(routes)) {
      const routeMiddlewares: { [key: string]: UseMiddlewareOption[] } = Reflect.getMetadata('use-middlewares', controller, key) ?? {};
      for (const route of routes[key]) {
        const { uri, method } = route;
        const actionMiddlewareOptions = routeMiddlewares[key] ?? [];
        router.register(`${prefix}${uri}`, [method], controller, key, [...controllerMiddlewareOptions, ...actionMiddlewareOptions]);
      }
    }
  }
}

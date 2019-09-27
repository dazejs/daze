/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import is from 'core-util-is'
import { Container} from '../container'
import { IllegalArgumentError} from '../errors/illegal-argument-error'
import { Application } from '../foundation/application'

export class Controller {
  /**
   * application instance
   */
  private app: Application;
  /**
   * Create Controller Module
   */
  constructor() {
    /**
     * @var app Application
     */
    this.app = Container.get('app');
  }

  /**
   * register a controller
   */
  public register(controller: any) {
    if (!is.isFunction(controller)) throw new IllegalArgumentError('controller must be a class!');
    this.parseController(controller);
    return this;
  }

  /**
   * parse a controller
   */
  private parseController(controller: any) {
    if (Reflect.getMetadata('type', controller.prototype) !== 'controller') throw new IllegalArgumentError('controller class must use @Controller decorator!');
    this.app.multiton(controller, controller);
    this.resolve(controller);
    return this;
  }

  /**
   * resolve this controller
   */
  public resolve(controller: any) {
    const routes = Reflect.getMetadata('routes', controller.prototype) || {};
    const prefix = Reflect.getMetadata('prefix', controller.prototype) || '';
    const controllerMiddlewares = Reflect.getMetadata('controllerMiddlewares', controller.prototype) || [];
    const routeMiddlewares = Reflect.getMetadata('routeMiddlewares', controller.prototype) || {};
    this.registerRoutes(controller, routes, prefix, controllerMiddlewares, routeMiddlewares);
  }

  /**
   * register controller routes
   */
  private registerRoutes(controller: any, routes: any, prefix?: string, controllerMiddlewares?: any, routeMiddlewares?: any) {
    const Router = this.app.get('router');
    for (const key of Object.keys(routes)) {
      for (const route of routes[key]) {
        const { uri, method } = route;
        const actionMiddlewares = routeMiddlewares[key] || [];
        Router.register(`${prefix}${uri}`, [method], controller, key, [...controllerMiddlewares, ...actionMiddlewares]);
      }
    }
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Container} from '../container';
import { Application } from '../foundation/application';
import { ComponentType } from '../symbol';
import { Controller } from '../base';

export class ControllerManager {
  /**
   * application instance
   */
  app: Application = Container.get('app');

  /**
   * register a controller
   */
  public register(controller: typeof Controller) {
    if (Reflect.getMetadata('type', controller) !== ComponentType.Controller) return this;
    this.resolve(controller);
    return this;
  }

  /**
   * resolve this controller
   */
  public resolve(controller: typeof Controller) {
    const routes = Reflect.getMetadata('routes', controller) || {};
    const prefix = Reflect.getMetadata('prefix', controller) || '';
    const controllerMiddlewares = Reflect.getMetadata('controllerMiddlewares', controller) || [];
    const routeMiddlewares = Reflect.getMetadata('routeMiddlewares', controller) || {};
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

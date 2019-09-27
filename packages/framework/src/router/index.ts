/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Route } from './route'
import { Container } from '../container'
import { Dispatcher } from './dispatcher'
import { Trie } from './trie'
import { CORSMiddleware } from '../foundation/middlewares'

export class Router {
  app: any;
  collection: any;
  trie: any;
  /**
   * Create Router
   */
  constructor() {
    /**
     * @type app Application instance
     */
    this.app = Container.get('app');

    /**
     * @type collection Router Collection instance
     */
    this.trie = new Trie();
  }

  resolve() {
    return async (request: any) => {
      const metchedRoute = this.trie.match(request);
      const dispatcher = new Dispatcher(request, metchedRoute);
      return dispatcher.resolve();
      // return new ResponseFactory(res).output(request);
    };
  }

  register(uri: string, methods: string[], controller: any, action: string, middlewares: any[]) {
    if (Reflect.getMetadata('type', controller.prototype) !== 'controller') throw new Error('route must be register an controller!');
    const route = new Route(uri, methods, controller, action, middlewares);
    const controllerCrossOrigin = Reflect.getMetadata('controllerCrossOrigin', controller.prototype);
    const routeCrossOrigin = Reflect.getMetadata('routeCrossOrigin', controller.prototype) || {};

    if (controllerCrossOrigin) {
      route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [controllerCrossOrigin]);
    } else if (routeCrossOrigin[action]) {
      route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [routeCrossOrigin[action]]);
    }
    this.trie.add(route);
    return route;
  }
}

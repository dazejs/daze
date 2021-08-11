/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Container } from '../container';
import { Application } from '../foundation/application';
import { CORSMiddleware } from '../foundation/middlewares';
import { Request } from '../request';
// import { Response } from '../response';
import { Dispatcher } from './dispatcher';
import { Route } from './route';
import { Trie } from './trie';
import { UseMiddlewareOption } from '../decorators/use/interface';
// import * as zlib from 'zlib';
// import { Stream } from 'stream';

// const encodingMethods = {
//   gzip: zlib.createGzip,
//   deflate: zlib.createDeflate
// };


export class Router {
  app: Application = Container.get('app');

  trie: Trie = new Trie();

  resolve() {
    return async (request: Request) => {
      const metchedRoute = this.trie.match(request);
      const dispatcher = new Dispatcher(request, metchedRoute);
      return await dispatcher.resolve();
    };
  }

  register(uri: string, methods: string[], controller: any, action: string, middlewareOptions: UseMiddlewareOption[]) {
    if (Reflect.getMetadata('type', controller) !== 'controller') throw new Error('route must be register an controller!');
    const route = new Route(uri, methods, controller, action);
    for (const middlewareOption of middlewareOptions) {
      route.registerMiddleware(middlewareOption.middleware, middlewareOption.args);
    }
    const controllerCrossOrigin = Reflect.getMetadata('controllerCrossOrigin', controller);
    const routeCrossOrigin = Reflect.getMetadata('routeCrossOrigin', controller) || {};
    if (controllerCrossOrigin) {
      route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [controllerCrossOrigin]);
    } else if (routeCrossOrigin[action]) {
      route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [routeCrossOrigin[action]]);
    }
    // 路由响应是否加密
    const enctypt = Reflect.getMetadata('encrypt', controller, action) || Reflect.getMetadata('encrypt', controller);
    if (enctypt) route.enctypt = true;

    this.trie.add(route);
    return route;
  }
}

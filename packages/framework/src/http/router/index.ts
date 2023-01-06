/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Container } from '../../container';
import { Application } from '../../foundation/application';
import { CORSMiddleware } from '../../foundation/buildin-app/middlewares/cors';
import { Request } from '../request';
// import { Response } from '../response';
import { Dispatcher } from './dispatcher';
import { Route } from './route';
import { Trie } from './trie';
import { UseMiddlewareOption } from '../../decorators/use/interface';
import { MiddlewareService } from '../middleware';
// import * as zlib from 'zlib';
// import { Stream } from 'stream';
import Debug from 'debug';

import { Str } from '../../utils';

// const encodingMethods = {
//   gzip: zlib.createGzip,
//   deflate: zlib.createDeflate
// };

// 可选路由的正则表达式
const OPTIONAL_PARAM_REGEXP = /(\/:[^/()]*?)\?(\/?)/;

const debug = Debug('@dazejs/framework:router');

export class Router {
  app: Application = Container.get('app');

  trie: Trie = new Trie();

  private middleware: MiddlewareService;

  constructor() {
    this.middleware = new MiddlewareService(this.app);
  }

  /**
     * match
     * @param request 
     * @returns 
     */
  public match(request: Request) {
    return this.trie.match(request);
  }

  public createResolver(_matchedRoute?: any) {
    return async (request: Request) => {
      const method = request.getMethod()??'';
      const requestPath = request.getPath();
      const metchedRoute = _matchedRoute ?? this.match(request);
      debug(`已匹配路由:[${method}] - [${requestPath}] - ${!!metchedRoute}`);
      const dispatcher = new Dispatcher(request, metchedRoute);
      return this.middleware
        .handle(request, async () => dispatcher.resolve())
        .catch((err) => {
          throw err;
        });
    };
  }

  /**
     * 注册路由
     * @param uri
     * @param methods
     * @param option
     * @param controller
     * @param action
     * @param middlewareOptions
     * @returns
     */
  public register(uri: string, methods: string[], option: any, controller: any, action?: string, middlewareOptions: UseMiddlewareOption[] = []) {
    const optionalParamMatch = uri.match(OPTIONAL_PARAM_REGEXP);
    if (optionalParamMatch) {
      const pathFull = uri.replace(OPTIONAL_PARAM_REGEXP, '$1$2');
      const pathOptional = uri.replace(OPTIONAL_PARAM_REGEXP, '$2');
      this.register(pathFull, methods, option, controller, action, middlewareOptions);
      this.register(pathOptional, methods, option, controller, action, middlewareOptions);
    }
    this._register(uri, methods, option, controller, action, middlewareOptions);
     
  }

  /**
   * 注册
   * @param uri 
   * @param methods 
   * @param option 
   * @param controller 
   * @param action 
   * @param middlewareOptions 
   */
  private _register(uri: string, methods: string[], option: any, controller: any, action?: string, middlewareOptions: UseMiddlewareOption[] = []) {
    const isStereotypeController = Reflect.getMetadata('type', controller);
    if (isStereotypeController && typeof controller !== 'function') throw new Error('route must be register an controller!');
    const finalUri =
          (
            (option?.baseUrl !== undefined && option?.baseUrl !== null)
              ? Str.formatPrefix(option?.baseUrl)
              : Str.formatPrefix(this.app.get('config').get('app.baseUrl', ''))
          ) + Str.formatPrefix(uri); 
    const route = new Route(finalUri, methods, controller, action);
    for (const middlewareOption of middlewareOptions) {
      route.registerMiddleware(middlewareOption?.middleware, middlewareOption?.args);
    }
    if (isStereotypeController && action) {
      const controllerCrossOrigin = Reflect.getMetadata('controllerCrossOrigin', controller);
      const routeCrossOrigin = Reflect.getMetadata('routeCrossOrigin', controller) || {};
      if (controllerCrossOrigin) {
        route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [controllerCrossOrigin]);
      } else if (routeCrossOrigin[action]) {
        route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [routeCrossOrigin[action]]);
      }
    }
    this.trie.add(route);
  }
}

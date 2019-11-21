/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as http from 'http';
import { pathToRegexp, parse, Key } from 'path-to-regexp';

import { Container } from '../container';
import { Application } from '../foundation/application';
import { Middleware } from '../middleware';
import { Request } from '../request';
import { Response } from '../response';
import { parsePattern } from './helpers';


export class Route {

  /**
   * application
   */
  app: Application = Container.get('app');

  /**
   * route params keys
   */
  keys: Key[] = [];

  /**
   * request uri
   */
  uri: string;

  /**
   * route methods
   */
  methods: string[];

  /**
   * route regexp
   */
  regexp: RegExp;

  /**
   * route controller
   */
  controller: any;

  /**
   * route controller action
   */
  action: string;

  /**
   * route middleware instance
   */
  middleware: Middleware = new Middleware();

  /**
   * Create Route
   * @param uri route URI
   * @param methods route methods
   * @param controller controller
   * @param action controller action
   * @param middlewares route middlewares
   */
  constructor(uri: string, methods: string[] = [], controller: any = null, action = '', middlewares: any[] = []) {
    /**
     * @type uri URI
     */
    this.uri = uri;

    /**
     * @type methods upper case method name
     */
    this.methods = this.parseMethods(methods);

    /**
     * @type regexp path RegExp
     */
    this.regexp = pathToRegexp(uri, this.keys);

    /**
     * @type controller controller
     */
    this.controller = controller;

    /**
     * @type action controller action name
     */
    this.action = action;

    /**
     * patch HEAD method with GET method
     */
    if (this.methods.includes('GET') && !this.methods.includes('HEAD')) {
      this.methods.push('HEAD');
    }

    this.registerControllerMiddlewares(middlewares);
  }

  get pieces() {
    const pieces = parse(this.uri);
    const res = [];
    for (const piece of pieces) {
      if (piece && typeof piece === 'string') {
        res.push(...parsePattern(piece).map(p => {
          if (p === '*') {
            return {
              key: p,
              type: 'all',
            };
          }
          return {
            key: p,
            type: 'static',
          };
        }));
      } else if (piece && typeof piece === 'object') {
        res.push({
          key: piece.pattern,
          type: 'reg',
        });
      }
      
    }
    return res;
  }

  /**
   * register route middleware
   * @param middleware
   */
  registerMiddleware(middleware: any, args: any[]) {
    if (middleware && typeof middleware === 'function') {
      this.middleware.register(middleware, args);
    }
    return this;
  }

  addMethod(method: string) {
    const _method = method.toUpperCase();
    if (http.METHODS.includes(_method) && !this.methods.includes(_method)) {
      this.methods.push(_method);
    }
    return this;
  }


  parseMethods(methods: string[] = []) {
    const _methods = [];
    for (const method of methods) {
      const _method = method.toUpperCase();
      _methods.push(_method);
    }
    return [...new Set(_methods)];
  }

  /**
   * get route params
   * @param path request path
   */
  getParams(requestPath: string) {
    return requestPath.match(this.regexp)?.slice(1) ?? [];
  }

  /**
   * register Middlewares in Middleware instance
   */
  registerControllerMiddlewares(middlewares: any) {
    if (!Array.isArray(middlewares)) return this;
    for (const middleware of middlewares) {
      this.middleware.register(middleware);
    }
    return this;
  }

  /**
   * check the path is matched this route
   * @param requestPath request path
   */
  match(requestPath: string) {
    return !!this.regexp.exec(requestPath);
  }

  async resolve(request: Request) {
    const controller = this.app.get(this.controller, [request]);
    const routeParams = this.getParams(request.path);
    const res = await controller[this.action](...routeParams);
    if (res instanceof Response) return res;
    return (new Response()).setData(res);
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import http from 'http'
import pathToRegExp from 'path-to-regexp'
import is from 'core-util-is'
import { Container } from '../container'
import { Middleware } from '../middleware'
import { Response } from '../response'
import { parsePattern } from './helpers'

export class Route {
  app: any;
  keys: any;
  uri: any;
  methods: any;
  regexp: any;
  controller: any;
  action: any;
  middleware: any;
  /**
   * Create Route
   * @param uri route URI
   * @param methods route methods
   * @param controller controller
   * @param action controller action
   * @param middlewares route middlewares
   */
  constructor(uri: string, methods: string[] = [], controller: any = null, action: string = '', middlewares: any[] = []) {
    this.app = Container.get("app");
    /**
     * @type keys route params keys
     */
    this.keys = [];

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
    this.regexp = pathToRegExp(uri, this.keys);

    /**
     * @type controller controller
     */
    this.controller = controller;

    /**
     * @type action controller action name
     */
    this.action = action;

    /**
     * @type middleware Middleware instance
     */
    this.middleware = new Middleware();

    /**
     * patch HEAD method with GET method
     */
    if (this.methods.includes("GET") && !this.methods.includes("HEAD")) {
      this.methods.push("HEAD");
    }

    // this.registerDefaultMiddlewares();

    this.registerControllerMiddlewares(middlewares);
  }

  get pieces() {
    const pieces = pathToRegExp.parse(this.uri);
    const res = [];
    for (const piece of pieces) {
      if (piece && typeof piece === 'string') {
        res.push(...parsePattern(piece).map(p => ({
          key: p,
          type: 'static',
        })));
      }
      if (piece && typeof piece === 'object') {
        res.push({
          key: piece.pattern,
          type: 'reg',
        });
      }
    }
    return res;
  }

  // /**
  //  * register default route middlewares
  //  */
  // registerDefaultMiddlewares() {
  //   // this.middleware.register(LoadSessionMiddleware);
  //   // this.middleware.register(VerifyCsrfTokenMiddleware);
  // }

  /**
   * register route middleware
   * @param middleware
   */
  registerMiddleware(middleware: any, args: any[]) {
    if (middleware && is.isFunction(middleware)) {
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


  parseMethods(methods: any[] = []) {
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
    return requestPath.match(this.regexp)!.slice(1);
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
    return this.regexp.test(requestPath);
  }

  async resolve(request: any) {
    const controller = this.app.get(this.controller, [request]);
    const routeParams = this.getParams(request.path);
    const res = await controller[this.action](...routeParams);
    if (res instanceof Response) return res;
    return (new Response()).setData(res);
  }
}

/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Middleware } from '../base/middleware';
import { Request } from '../request';
import { Response } from '../response';
import { TNext } from '../middleware';

function decoratorClass(target: any, middleware: any) {
  const middlewares = Reflect.getMetadata('controllerMiddlewares', target) || [];
  middlewares.push(middleware);
  Reflect.defineMetadata('controllerMiddlewares', middlewares, target);
  return target;
}

function decoratorMethod(target: any, name: string, descriptor: any, middleware: any) {
  const middlewares = Reflect.getMetadata('routeMiddlewares', target.constructor) || {};
  if (!middlewares[name]) {
    middlewares[name] = [];
  }
  middlewares[name].push(middleware);
  Reflect.defineMetadata('routeMiddlewares', middlewares, target.constructor);
  return descriptor;
}

function handle(args: any[], middleware: any) {
  if (args.length === 1) {
    const [target] = args;
    return decoratorClass(target, middleware);
  }
  const [target, name, descriptor] = args;
  return decoratorMethod(target, name, descriptor, middleware);
}

export function UseMiddleware(middleware: typeof Middleware | ((request: Request, next: TNext) => Promise<Response> | Response)) {
  return (...args: any[]) => handle(args, middleware);
};

export function useMiddleware(middleware: typeof Middleware | ((request: Request, next: TNext) => Promise<Response> | Response)) {
  return UseMiddleware(middleware);
}

export function Use(middleware: typeof Middleware | ((request: Request, next: TNext) => Promise<Response> | Response)) {
  return UseMiddleware(middleware);
}

export function use(middleware: typeof Middleware | ((request: Request, next: TNext) => Promise<Response> | Response)) {
  return UseMiddleware(middleware);
}

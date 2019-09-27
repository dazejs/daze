/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function decoratorClass(target: any, middleware: any) {
  const middlewares = Reflect.getMetadata('controllerMiddlewares', target.prototype) || [];
  middlewares.push(middleware);
  Reflect.defineMetadata('controllerMiddlewares', middlewares, target.prototype);
  return target;
}

function decoratorMethod(target: any, name: string, descriptor: any, middleware: any) {
  const middlewares = Reflect.getMetadata('routeMiddlewares', target) || {};
  if (!middlewares[name]) {
    middlewares[name] = [];
  }
  middlewares[name].push(middleware);
  Reflect.defineMetadata('routeMiddlewares', middlewares, target);
  return descriptor;
}

function handle(args: any[], middleware: any) {
  if (args.length === 1) {
    const [target] = args
    return decoratorClass(target, middleware);
  }
  const [target, name, descriptor] = args
  return decoratorMethod(target, name, descriptor, middleware);
}

export function useMiddleware(middleware: any) {
  return (...args: any[]) => handle(args, middleware);
};

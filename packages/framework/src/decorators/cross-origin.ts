/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
function decoratorClass(target: any, options: any) {
  Reflect.defineMetadata('controllerCrossOrigin', {
    ...options,
  }, target);
  return target;
}

function decoratorMethod(target: any, name: string, descriptor: any, options: any) {
  const corses = Reflect.getMetadata('routeCrossOrigin', target.constructor) || {};
  corses[name] = {
    ...options,
  };
  Reflect.defineMetadata('routeCrossOrigin', corses, target.constructor);
  return descriptor;
}

function handle(args: any[], options: any) {
  if (args.length === 1) {
    const [target] = args;
    return decoratorClass(target, options);
  }
  const [target, name, descriptor] = args;
  return decoratorMethod(target, name, descriptor, options);
}

export function crossOrigin(options: any = {}) {
  return (...args: any[]) => handle(args, options);
};

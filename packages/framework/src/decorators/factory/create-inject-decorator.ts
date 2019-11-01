/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// import { patchClass, patchProperty, patchMethod } from './patch-decorator'

function handle(args: any[], params: any, type: string) {

  if (args.length === 1) {
    const [target] = args
    Reflect.defineMetadata('injectable', true, target);
    const injectors = Reflect.getMetadata('injectparams', target) || [];
    Reflect.defineMetadata('injectparams', [
      ...injectors,
      [type, params],
    ], target);
    return target;
  }
  const [target, key] = args
  Reflect.defineMetadata('injectable', true, target.constructor);
  const injectors = Reflect.getMetadata('injectparams', target.constructor, key) || [];
  Reflect.defineMetadata('injectparams', [
    ...injectors,
    [type, params],
  ], target.constructor, key);
  return target; 
}

export function createInjectDecorator(type: string){
  return (...args: any[]) => (...argsClass: any[])  => handle(argsClass, args, type);
};

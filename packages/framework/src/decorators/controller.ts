/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers';

export function controller(...prefixs: string[]): ClassDecorator {
  return function (constructor) {
    const isExtendsFromBase = Reflect.getMetadata('isExtendsFromBase', constructor);
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('isRoute', true, constructor);
    Reflect.defineMetadata('type', 'controller', constructor);
    Reflect.defineMetadata('prefixs', prefixs.length > 0 ? prefixs.map(prefix => formatPrefix(prefix)) : [formatPrefix()], constructor);
    if (isExtendsFromBase) return constructor;
  };
};
/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers';

export function controller(...prefixs: string[]): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('type', 'controller', constructor);
    Reflect.defineMetadata('prefixs', prefixs.length > 0 ? prefixs.map(prefix => formatPrefix(prefix)) : [formatPrefix()], constructor);
  };
};
/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers';

export function Route(...prefixs: string[]): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('isRoute', true, constructor);
    Reflect.defineMetadata('type', 'controller', constructor);
    Reflect.defineMetadata('prefixs', prefixs.length > 0 ? prefixs.map(prefix => formatPrefix(prefix)) : [formatPrefix()], constructor);
    // Reflect.defineMetadata('prefix', formatPrefix(), constructor);
  };
};

export function route(...prefixs: string[]): ClassDecorator {
  return Route(...prefixs);
};

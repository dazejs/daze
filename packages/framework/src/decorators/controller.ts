/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { formatPrefix } from './helpers';

export const controller = function (...prefixs: string[]): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('type', 'controller', constructor);
    Reflect.defineMetadata('prefixs', prefixs.length > 0 ? prefixs.map(prefix => formatPrefix(prefix)) : [formatPrefix()], constructor);
  };
};
export const Controller = controller;
export const route = controller;
export const Route = controller;

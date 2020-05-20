/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { Str } from '../../utils';
import { component } from './component';

export const controller = function (...prefixs: string[]): ClassDecorator {
  return function (constructor) {
    component('', 'controller')(constructor);
    Reflect.defineMetadata('prefixs', prefixs.length > 0 ? prefixs.map(prefix => Str.formatPrefix(prefix)) : [formatPrefix()], constructor);
  };
};
export const Controller = controller;
export const route = controller;
export const Route = controller;

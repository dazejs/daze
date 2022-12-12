/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { Str } from '../../utils';
import { Component } from './component';

export const Controller = function (...prefixs: string[]): ClassDecorator {
  return function (constructor) {
    Component('', 'controller')(constructor);
    Reflect.defineMetadata('prefixs', prefixs.length > 0 ? prefixs.map(prefix => Str.formatPrefix(prefix)) : [Str.formatPrefix()], constructor);
  };
};
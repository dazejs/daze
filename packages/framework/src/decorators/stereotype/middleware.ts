/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { component } from './component';
import * as symbols from '../../symbol';

export const middleware = function (name?: string): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata(symbols.DISABLE_INJECT, true, constructor.prototype, 'resolve');
    component(name, 'middleware')(constructor);
  };
};

export const Middleware = middleware;
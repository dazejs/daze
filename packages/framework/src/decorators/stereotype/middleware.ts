/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { component } from './component';

export const middleware = function (name?: string): ClassDecorator {
  return function (constructor) {
    component(name, 'middleware')(constructor);
  };
};

export const Middleware = middleware;
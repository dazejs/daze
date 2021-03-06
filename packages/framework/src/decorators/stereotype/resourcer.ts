/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { component } from './component';

export const resourcer = function (name?: string): ClassDecorator {
  return function (constructor) {
    component(name, 'resource')(constructor);
  };
};

export const Resourcer = resourcer;

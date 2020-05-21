/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { component } from './component';

export const validator = function (name = ''): ClassDecorator {
  return function (constructor) {
    component(name, 'validator')(constructor);
  };
};

export const Validator = validator;
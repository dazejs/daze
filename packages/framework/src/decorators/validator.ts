/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export const validator = function (name = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', 'validator', constructor);
  };
};

export const Validator = validator;
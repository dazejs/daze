/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

export const service = function (name?: string): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', 'service', constructor);
  };
};

export const Service = service;
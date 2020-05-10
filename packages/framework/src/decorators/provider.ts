/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

export const provider = function (name?: string): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', 'provider', constructor);
  };
};

export const Provider = provider;
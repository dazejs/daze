/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function ignore(): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('ignore', true, constructor);
    return constructor;
  };
};

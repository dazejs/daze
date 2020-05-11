/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export const injectable: ClassDecorator = function (constructor: any) {
  Reflect.defineMetadata('injectable', true, constructor);
};

export const Injectable = injectable;
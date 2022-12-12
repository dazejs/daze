/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

export const Ignore: ClassDecorator = function (constructor: any) {
  Reflect.defineMetadata('ignore', true, constructor);
};


/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

export const ignore: ClassDecorator = function (constructor: any) {
  Reflect.defineMetadata('ignore', true, constructor);
};

export const Ignore = ignore;

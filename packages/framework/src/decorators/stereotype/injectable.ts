/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { INJECTABLE } from '../../symbol';

export const injectable: ClassDecorator = function (constructor: any) {
  Reflect.defineMetadata(INJECTABLE, true, constructor);
};

export const Injectable = injectable;

/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { MULTITON, SINGLETON } from '../symbol';

export const multiton: ClassDecorator = function (target: any) {
  Reflect.defineMetadata(SINGLETON, false, target);
  Reflect.defineMetadata(MULTITON, true, target);
};

/**
 * Alias
 */
export const Multiton = multiton;

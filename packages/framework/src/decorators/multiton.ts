/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { MULTITON, SINGLETON } from '../symbol';

export function Multiton(): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(SINGLETON, false, target);
    Reflect.defineMetadata(MULTITON, true, target);
  };
};

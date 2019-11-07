/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { SINGLETON, MULTITON } from '../symbol';

export function Singleton(): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(MULTITON, false, target);
    Reflect.defineMetadata(SINGLETON, true, target);
  };
};

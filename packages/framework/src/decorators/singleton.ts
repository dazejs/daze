/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { MULTITON, SINGLETON } from '../symbol';


export function singleton(): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata(MULTITON, false, target);
    Reflect.defineMetadata(SINGLETON, true, target);
  };
};
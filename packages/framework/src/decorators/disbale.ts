/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */
import { DISABLE_INJECT } from '../symbol';

export const disable = (target: any, propertyKey?: string | symbol) => {
  if (!propertyKey) { // Class
    Reflect.defineMetadata(DISABLE_INJECT, true, target);
  } else {
    Reflect.defineMetadata(DISABLE_INJECT, true, target.constructor, propertyKey);
  }
};

export const Disable = disable;

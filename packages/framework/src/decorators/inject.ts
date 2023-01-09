/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { decoratorFactory } from './factory/decorator-factory';

/**
  * for javascript
  * Inject by custom name
  * Supports injection in a variety of ways, including but not limited to methods, properties, and constructors
  * 
  * @param name 
  * @param args 
  */
export const Inject = function (name?: any, ...args: any[]) {
  return decoratorFactory(name, args);
};
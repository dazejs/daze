/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { createInjectDecorator } from '../factory/create-inject-decorator';

/**
 * Inject by custom name
 * Supports injection in a variety of ways, including but not limited to methods, properties, and constructors
 * 
 * @param name 
 * @param args 
 */
export const inject = function (name?: any, ...args: any[]) {
  return createInjectDecorator(name, args);
};

/**
 * Alias
 */
export const Inject = inject;

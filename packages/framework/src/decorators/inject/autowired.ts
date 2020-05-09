/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { createInjectDecorator } from '../factory/create-inject-decorator';

/**
 * Automatically inject the property based on the property name
 * 
 * @param target 
 * @param propertyKey 
 */
export const autowired: PropertyDecorator = function (target: Record<string, any>, propertyKey: string | symbol) {
  return createInjectDecorator(propertyKey.toString())(target, propertyKey);
};

/**
 * 别名
 * Alias
 */
export const Autowired = autowired;
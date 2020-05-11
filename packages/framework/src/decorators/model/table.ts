/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

/**
 * table
 *
 * @returns {ClassDecorator}
 */
export const table = function (table: string): ClassDecorator {
  return function <TFunction extends Function> (target: TFunction) {
    Reflect.defineMetadata('table', table, target);
  };
};

/**
 * Alias
 */
export const Table = table;

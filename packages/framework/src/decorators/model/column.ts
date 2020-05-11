/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { ColumnDescription } from '../../orm/model';

/**
 * Column
 *
 * @returns {PropertyDecorator}
 */
export const column = function (type = 'varchar', length = 255): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: Map<string, ColumnDescription> = Reflect.getMetadata('columns', target.constructor) ?? new Map();
    columns.set(propertyKey, {
      type,
      length,
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
  };
};

/**
 * Alias
 */
export const Column = column;


/**
 * Primary Column
 *
 * @returns {PropertyDecorator}
 */
export const primaryColumn = function (type = 'int', length = 11): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: Map<string, ColumnDescription> = Reflect.getMetadata('columns', target.constructor) ?? new Map();
    columns.set(propertyKey, {
      type,
      length,
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
    Reflect.defineMetadata('primaryKey', propertyKey, target.constructor);
    Reflect.defineMetadata('incrementing', false, target.constructor);
  };
};

/**
 * Alias
 */
export const PrimaryColumn = primaryColumn;

/**
 * Auto Increment Primary Column
 *
 * @returns {PropertyDecorator}
 */
export const autoIncrementPrimaryColumn = function (type = 'int', length = 11): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: Map<string, ColumnDescription> = Reflect.getMetadata('columns', target.constructor) ?? new Map();
    columns.set(propertyKey, {
      type,
      length,
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
    Reflect.defineMetadata('primaryKey', propertyKey, target.constructor);
    Reflect.defineMetadata('incrementing', true, target.constructor);
  };
};

/**
 * Alias
 */
export const AutoIncrementPrimaryColumn = autoIncrementPrimaryColumn;

/**
 * Soft Delete Column
 *
 * @returns {PropertyDecorator}
 */
export const softDeleteColumn = function (type = 'int', length = 11): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: Map<string, ColumnDescription> = Reflect.getMetadata('columns', target.constructor) ?? new Map();
    columns.set(propertyKey, {
      type,
      length,
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
    Reflect.defineMetadata('softDeleteKey', propertyKey, target.constructor);
  };
};

/**
 * Alias
 */
export const SoftDeleteColumn = softDeleteColumn;

/**
 * Create Timestamp Column
 *
 * @returns {PropertyDecorator}
 */
export const createTimestampColumn = function (type = 'int', length = 11): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: Map<string, ColumnDescription> = Reflect.getMetadata('columns', target.constructor) ?? new Map();
    columns.set(propertyKey, {
      type,
      length,
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
    Reflect.defineMetadata('createTimestampKey', propertyKey, target.constructor);
  };
};

/**
 * Alias
 */
export const CreateTimestampColumn = createTimestampColumn;

/**
 * Update Timestamp Column
 *
 * @returns {PropertyDecorator}
 */
export const updateTimestampColumn = function (type = 'int', length = 11): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: Map<string, ColumnDescription> = Reflect.getMetadata('columns', target.constructor) ?? new Map();
    columns.set(propertyKey, {
      type,
      length,
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
    Reflect.defineMetadata('updateTimestampKey', propertyKey, target.constructor);
  };
};

/**
 * Alias
 */
export const UpdateTimestampColumn = updateTimestampColumn;
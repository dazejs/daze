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
export const Column = function (type = 'varchar', length = 255): PropertyDecorator {
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
 * Column
 *
 * @returns {PropertyDecorator}
 */
export const CustomColumn = function (): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: string[] = Reflect.getMetadata('customColumns', target.constructor) ?? [];
    columns.push(propertyKey);
    Reflect.defineMetadata('customColumns', columns, target.constructor);
  };
};


/**
 * Primary Column
 *
 * @returns {PropertyDecorator}
 */
export const PrimaryColumn = function (type = 'int', length = 11): PropertyDecorator {
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
 * Auto Increment Primary Column
 *
 * @returns {PropertyDecorator}
 */
export const AutoIncrementPrimaryColumn = function (type = 'int', length = 11): PropertyDecorator {
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
 * Soft Delete Column
 *
 * @returns {PropertyDecorator}
 */
export const SoftDeleteColumn = function (type = 'int', length = 11): PropertyDecorator {
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
 * Create Timestamp Column
 *
 * @returns {PropertyDecorator}
 */
export const CreateTimestampColumn = function (type = 'int', length = 11): PropertyDecorator {
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
 * Update Timestamp Column
 *
 * @returns {PropertyDecorator}
 */
export const UpdateTimestampColumn = function (type = 'int', length = 11): PropertyDecorator {
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
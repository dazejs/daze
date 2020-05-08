
import { ColumnDescription } from '../../orm/model';


/**
 * Column
 *
 * @returns {PropertyDecorator}
 */
export function column(type = 'varchar', length = 255): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const columns: Map<string, ColumnDescription> = Reflect.getMetadata('columns', target.constructor) ?? new Map();
    columns.set(propertyKey, {
      type,
      length,
    });
    Reflect.defineMetadata('columns', columns, target.constructor);
  };
}


/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function primaryColumn(type = 'int', length = 11): PropertyDecorator {
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
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function autoIncrementPrimaryColumn(type = 'int', length = 11): PropertyDecorator {
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
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function softDeleteColumn(type = 'int', length = 11): PropertyDecorator {
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
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function createTimestampColumn(type = 'int', length = 11): PropertyDecorator {
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
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function updateTimestampColumn(type = 'int', length = 11): PropertyDecorator {
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
}
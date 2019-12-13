
import { ColumnDescription } from '../../model/model';


/**
 * Column
 *
 * @returns {PropertyDecorator}
 */
export function Column(type = 'varchar', length = 255): PropertyDecorator {
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

export function column(type = 'varchar', length = 255) {
  return Column(type, length);
}


/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function PrimaryColumn(type = 'int', length = 11): PropertyDecorator {
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

export function primaryColumn(type = 'int', length = 11) {
  return PrimaryColumn(type, length);
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function AutoIncrementPrimaryColumn(type = 'int', length = 11): PropertyDecorator {
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

export function autoIncrementPrimaryColumn(type = 'int', length = 11) {
  return AutoIncrementPrimaryColumn(type, length);
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function SoftDeleteColumn(type = 'int', length = 11): PropertyDecorator {
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

export function softDeleteColumn(type = 'int', length = 11) {
  return SoftDeleteColumn(type, length);
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function CreateTimestampColumn(type = 'int', length = 11): PropertyDecorator {
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


export function createTimestampColumn(type = 'int', length = 11) {
  return CreateTimestampColumn(type, length);
}

/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function UpdateTimestampColumn(type = 'int', length = 11): PropertyDecorator {
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

export function updateTimestampColumn(type = 'int', length = 11) {
  return UpdateTimestampColumn(type, length);
}
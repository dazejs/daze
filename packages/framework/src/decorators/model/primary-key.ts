
/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export function PrimaryKey(): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    const columns = Reflect.getMetadata('columns', target.constructor) ?? [];
    columns.push(propertyKey);
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
export function AutoIncrementPrimaryKey(): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    const columns = Reflect.getMetadata('columns', target.constructor) ?? [];
    columns.push(propertyKey);
    Reflect.defineMetadata('columns', columns, target.constructor);
    Reflect.defineMetadata('primaryKey', propertyKey, target.constructor);
    Reflect.defineMetadata('incrementing', true, target.constructor);
  };
}
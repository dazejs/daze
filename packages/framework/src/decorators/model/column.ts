


/**
 * Column
 *
 * @returns {PropertyDecorator}
 */
export function Column(): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    const columns = Reflect.getMetadata('columns', target.constructor) ?? [];
    columns.push(propertyKey);
    Reflect.defineMetadata('columns', columns, target.constructor);
  };
}
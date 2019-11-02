

export function Column(): PropertyDecorator {
  return function (target, propertyKey) {
    const columns = Reflect.getMetadata('columns', target.constructor) || [];
    columns.push(propertyKey);
    Reflect.defineMetadata('columns', columns, target.constructor);
  };
}


export function PrimaryKey(): PropertyDecorator {
  return function (target, propertyKey) {
    const columns = Reflect.getMetadata('columns', target.constructor) || [];
    columns.push(propertyKey);
    Reflect.defineMetadata('columns', columns, target.constructor);
    Reflect.defineMetadata('primaryKey', propertyKey, target.constructor);
  };
}
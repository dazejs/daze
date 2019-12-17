/**
 * HasOne
 *
 * @returns {PropertyDecorator}
 */
export function HasOne<TEntity>(Entity: TEntity, foreignKey: string, localKey: string): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, any> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'hasOne',
      entity: Entity,
      foreignKey: foreignKey,
      localKey: localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

/**
 * BelongsTo
 *
 * @returns {PropertyDecorator}
 */
export function BelongsTo<TEntity>(Entity: TEntity, foreignKey: string, localKey: string): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, any> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'belongsTo',
      entity: Entity,
      foreignKey: foreignKey,
      localKey: localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}
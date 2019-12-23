import { RelationDesc } from '../../model/model';
import { Entity as EntityBase } from 'src/base';

/**
 * HasOne
 *
 * @returns {PropertyDecorator}
 */
export function HasOne<T extends EntityBase>(Entity: { new(): T }, foreignKey: string, localKey: string): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
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

export function hasOne<T extends EntityBase>(Entity: { new(): T }, foreignKey: string, localKey: string): PropertyDecorator {
  return HasOne(Entity, foreignKey, localKey);
}

/**
 * BelongsTo
 *
 * @returns {PropertyDecorator}
 */
export function BelongsTo<T extends EntityBase>(Entity: { new(): T }, foreignKey: string, localKey: string): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
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

export function belongsTo<T extends EntityBase>(Entity: { new(): T }, foreignKey: string, localKey: string): PropertyDecorator {
  return BelongsTo(Entity, foreignKey, localKey);
}
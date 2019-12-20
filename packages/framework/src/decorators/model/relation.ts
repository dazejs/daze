import { RelationDesc } from '../../model/model';
import { HasOne as HasOneRelation } from '../../model/relations/has-one';
import { BelongsTo as BelongsToRelation } from '../../model/relations/belongs-to';

/**
 * HasOne
 *
 * @returns {PropertyDecorator}
 */
export function HasOne<TEntity>(Entity: TEntity, foreignKey: string, localKey: string): PropertyDecorator {
  return function(target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc<TEntity>> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      relation: HasOneRelation,
      type: 'hasOne',
      entity: Entity,
      foreignKey: foreignKey,
      localKey: localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

export function hasOne<TEntity>(Entity: TEntity, foreignKey: string, localKey: string): PropertyDecorator {
  return HasOne(Entity, foreignKey, localKey);
}

/**
 * BelongsTo
 *
 * @returns {PropertyDecorator}
 */
export function BelongsTo<TEntity>(Entity: TEntity, foreignKey: string, localKey: string): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc<TEntity>> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      relation: BelongsToRelation,
      type: 'belongsTo',
      entity: Entity,
      foreignKey: foreignKey,
      localKey: localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

export function belongsTo<TEntity>(Entity: TEntity, foreignKey: string, localKey: string): PropertyDecorator {
  return BelongsTo(Entity, foreignKey, localKey);
}
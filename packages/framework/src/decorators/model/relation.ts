import { RelationDesc } from '../../model/model';
import { Entity as EntityBase } from 'src/base';

interface ManyRealtionOptions {
  pivot?: { new(): EntityBase };
  relatedPivotKey?: string;
  foreignPivotKey?: string;
}

interface OneRelationOptions {
  foreignKey?: string;
  localKey?: string;
}


/**
 * HasOne
 *
 * @returns {PropertyDecorator}
 */
export function HasOne(RelationEntity: { new(): EntityBase }, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'hasOne',
      entity: RelationEntity,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

export function hasOne<TEntity extends EntityBase>(Entity: { new(): TEntity }, options: OneRelationOptions = {}): PropertyDecorator {
  return HasOne(Entity, options);
}

/**
 * BelongsTo
 *
 * @returns {PropertyDecorator}
 */
export function BelongsTo<TEntity extends EntityBase>(Entity: { new(): TEntity }, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'belongsTo',
      entity: Entity,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

export function belongsTo<TEntity extends EntityBase>(Entity: { new(): TEntity }, options: OneRelationOptions = {}): PropertyDecorator {
  return BelongsTo(Entity, options);
}

/**
 * HasMany
 *
 * @returns {PropertyDecorator}
 */
export function HasMany<TEntity extends EntityBase>(Entity: { new(): TEntity }, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'hasMany',
      entity: Entity,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

export function hasMany<TEntity extends EntityBase>(Entity: { new(): TEntity }, options: OneRelationOptions = {}): PropertyDecorator {
  return HasMany(Entity, options);
}


/**
 * HasMany
 *
 * @returns {PropertyDecorator}
 */
export function BelongsToMany(Entity: { new(): EntityBase }, options: ManyRealtionOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'belongsToMany',
      entity: Entity,
      pivot: options.pivot,
      foreignPivotKey: options.foreignPivotKey,
      relatedPivotKey: options.relatedPivotKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

export function belongsToMany(Entity: { new(): EntityBase }, options: ManyRealtionOptions = {}): PropertyDecorator {
  return BelongsToMany(Entity, options);
}
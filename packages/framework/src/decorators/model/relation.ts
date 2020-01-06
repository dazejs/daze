import { RelationDesc } from '../../model/model';
import { Entity as EntityBase } from 'src/base';

interface ManyRealtionOptions {
  pivot?: typeof EntityBase;
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
export function HasOne(RelationEntity: typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
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

export function hasOne(Entity: typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
  return HasOne(Entity, options);
}

/**
 * BelongsTo
 *
 * @returns {PropertyDecorator}
 */
export function BelongsTo(Entity: typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
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

export function belongsTo(Entity: typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
  return BelongsTo(Entity, options);
}

/**
 * HasMany
 *
 * @returns {PropertyDecorator}
 */
export function HasMany(Entity: typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
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

export function hasMany(Entity: typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
  return HasMany(Entity, options);
}


/**
 * HasMany
 *
 * @returns {PropertyDecorator}
 */
export function BelongsToMany(Entity: typeof EntityBase, options: ManyRealtionOptions = {}): PropertyDecorator {
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

export function belongsToMany(Entity: typeof EntityBase, options: ManyRealtionOptions = {}): PropertyDecorator {
  return BelongsToMany(Entity, options);
}
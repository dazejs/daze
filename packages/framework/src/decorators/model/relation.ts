import { RelationDesc } from '../../model/model';
import { BaseEntity as EntityBase } from '../../base';

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
export function hasOne(fn: () => typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'hasOne',
      entityFn: fn,
      foreignKey: options.foreignKey,
      localKey: options.localKey
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
export function belongsTo(fn: () => typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'belongsTo',
      entityFn: fn,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

/**
 * HasMany
 *
 * @returns {PropertyDecorator}
 */
export function hasMany(fn: () => typeof EntityBase, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'hasMany',
      entityFn: fn,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}

/**
 * HasMany
 *
 * @returns {PropertyDecorator}
 */
export function belongsToMany(fn: () => typeof EntityBase, options: ManyRealtionOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return target;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'belongsToMany',
      entityFn: fn,
      pivot: options.pivot,
      foreignPivotKey: options.foreignPivotKey,
      relatedPivotKey: options.relatedPivotKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
    return target;
  };
}
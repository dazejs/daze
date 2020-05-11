/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { RelationDesc } from '../../orm/model';

interface ManyRealtionOptions {
  pivot?: any;
  relatedPivotKey?: string;
  foreignPivotKey?: string;
}

interface OneRelationOptions {
  foreignKey?: string;
  localKey?: string;
}

/**
 * Has One
 *
 * @returns {PropertyDecorator}
 */
export const hasOne = function (fn: () => any, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'hasOne',
      entityFn: fn,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
  };
};

/**
 * Alias
 */
export const HasOne = hasOne;

/**
 * Belongs To
 *
 * @returns {PropertyDecorator}
 */
export const belongsTo = function (fn: () => any, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'belongsTo',
      entityFn: fn,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
  };
};

/**
 * Alias
 */
export const BelongsTo = belongsTo;

/**
 * HasMany
 *
 * @returns {PropertyDecorator}
 */
export const hasMany = function (fn: () => any, options: OneRelationOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'hasMany',
      entityFn: fn,
      foreignKey: options.foreignKey,
      localKey: options.localKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
  };
};

/**
 * Alias
 */
export const HasMany = hasMany;

/**
 * belongsToMany
 *
 * @returns {PropertyDecorator}
 */
export const belongsToMany = function (fn: () => any, options: ManyRealtionOptions = {}): PropertyDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') return;
    const relations: Map<string, RelationDesc> = Reflect.getMetadata('relations', target.constructor) ?? new Map();
    relations.set(propertyKey, {
      type: 'belongsToMany',
      entityFn: fn,
      pivot: options.pivot,
      foreignPivotKey: options.foreignPivotKey,
      relatedPivotKey: options.relatedPivotKey
    });
    Reflect.defineMetadata('relations', relations, target.constructor);
  };
};

/**
 * Alias
 */
export const BelongsToMany = belongsToMany;
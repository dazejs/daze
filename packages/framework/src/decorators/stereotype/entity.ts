/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Component } from './component';

export const Entity = function (name: string): ClassDecorator {
  return function (constructor) {
    Component(undefined, 'entity')(constructor);
    Reflect.defineMetadata('table', name, constructor);
  };
};
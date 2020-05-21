/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { component } from './component';

export const entity = function (name?: string): ClassDecorator {
  return function (constructor) {
    component(name, 'entity')(constructor);
  };
};
export const Entity = entity;

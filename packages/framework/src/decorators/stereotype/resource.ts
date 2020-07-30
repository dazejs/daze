/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { component } from './component';
import { injectable } from './injectable';

export const resource = function (name?: string): ClassDecorator {
  return function (constructor) {
    injectable(constructor);
    component(name, 'resource')(constructor);
  };
};

export const Resource = resource;

/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Component } from './component';

export const Resourcer = function (name?: string): ClassDecorator {
  return function (constructor) {
    Component(name, 'resource')(constructor);
  };
};

/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */
import { Component } from './component';

export const Service = function (name?: string): ClassDecorator {
  return function (constructor) {
    Component(name, 'service')(constructor);
  };
};

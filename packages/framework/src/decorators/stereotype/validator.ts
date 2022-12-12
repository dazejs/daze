/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Component } from './component';

export const Validator = function (name = ''): ClassDecorator {
  return function (constructor) {
    Component(name, 'validator')(constructor);
  };
};
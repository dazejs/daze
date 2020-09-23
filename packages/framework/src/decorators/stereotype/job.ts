/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { component } from './component';

export const job = function (name?: string): ClassDecorator {
  return function (constructor) {
    component(name, 'job')(constructor);
  };
};
export const Job = job;

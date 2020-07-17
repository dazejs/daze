/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as verbs from './verb';

export * from './stereotype';
export * from './component-type';
export * from './cross-origin';
export * from './csrf';
export * from './factory/create-inject-decorator';
export * from './ignore';
export * from './inject';
export * from './model';
export * from './multiton';
export * from './order';
export * from './provider';
export * from './rest';
export * from './singleton';
export * from './use-middleware';
export * from './validates';
export const http = {
  ...verbs,
};
export const Http = http;


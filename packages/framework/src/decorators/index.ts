/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as httpContext from './contexts-http';
import * as verbs from './verb';

export * from './stereotype';
export * from './component-type';
export * from './contexts';
export * from './cross-origin';
export * from './csrf';
export * from './factory/create-inject-decorator';
export * from './http-code';
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
  ...httpContext
};
export const Http = http;


/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as httpContext from './contexts-http';
import * as verbs from './verb';

export * from './component';
export * from './component-type';
export * from './contexts';
export * from './controller';
export * from './cross-origin';
export * from './csrf';
export * from './entity';
export * from './factory/create-inject-decorator';
export * from './http-code';
export * from './ignore';
export * from './inject';
export * from './injectable';
export * from './middleware';
export * from './model';
export * from './multiton';
export * from './order';
export * from './provider';
export * from './provide';
export * from './resource';
export * from './rest';
export * from './service';
export * from './singleton';
export * from './use';
export * from './validates';
export * from './validator';
export const http = {
  ...verbs,
  ...httpContext
};
export const Http = http;


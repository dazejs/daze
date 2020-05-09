/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as httpContext from './contexts-http';
import { httpCode } from './http-code';
import * as verbs from './verb';


export const http = {
  code: httpCode,
  ...verbs,
  ...httpContext
};
export * from './rest';
export * from './multiton';
export * from './singleton';
export * from './component';
export * from './component-type';
export * from './ignore';
export * from './use';
export * from './contexts';
export * from './inject';
export * from './cross-origin';
export * from './validates';
export * from './injectable';
export * from './csrf';
export * from './model';
export * from './provider';
export * from './order';
export * from './factory/create-inject-decorator';
export * from './controller';
export * from './service';
export * from './middleware';
export * from './resource';
export * from './validator';
export * from './entity';

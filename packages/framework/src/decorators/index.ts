/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as HttpContext from './contexts-http';
import { HttpCode } from './http-code';
import * as Vberbs from './verb';


export const Http = {
  Code: HttpCode,
  ...Vberbs,
  ...HttpContext
};
export const http = Http; 
export * from './route';
export * from './rest';
export * from './multiton';
export * from './singleton';
export * from './component';
export * from './component-type';
export * from './ignore';
export * from './use-middleware';
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

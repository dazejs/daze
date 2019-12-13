/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as HttpContext from './contexts-http';
import * as Vberbs from './verb';


export const Http = {
  ...Vberbs,
  ...HttpContext
};
export const http = Http;
export * from './route';
export * from './rest';
export * from './multiton';
export * from './singleton';
export * from './component';
export * from './ignore';
export * from './use-middleware';
export * from './contexts';
export * from './cross-origin';
export * from './validates';
export * from './injectable';
export * from './csrf';
export * from './model';

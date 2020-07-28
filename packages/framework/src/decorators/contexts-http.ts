/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as symbols from '../symbol';
import { Tool } from '../utils';
import { decoratorFactory } from './factory/decorator-factory';

const { A, pipe } = Tool;

/**
 * Inject original http request
 */
export const originalReq = () => decoratorFactory(symbols.INJECTORS.REQ);
export const OriginalReq = originalReq;
export const req = originalReq;
export const Req = originalReq;

/**
 * Inject original http response
 */
export const originalRes = () => decoratorFactory(symbols.INJECTORS.RES);
export const OriginalRes = originalRes;
export const res = originalRes;
export const Res = originalRes;

/**
 * Inject daze http request
 */
export const request = () => decoratorFactory(symbols.INJECTORS.REQUEST);
export const Request = request;

/**
 * Inject daze http response
 */
export const response = () => decoratorFactory(symbols.INJECTORS.RESPONSE);
export const Response = response;

/**
 * Inject http query
 */
export const query = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.QUERY, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  });
export const Query = query;

/**
 * Inject http request params
 */
export const params = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.PARAMS, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  });
export const Params = params;

/**
 * Inject http request headers
 */
export const header = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.HEADERS, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key.toLowerCase()] ?? defaultValue;
    }
  });
export const Header = header;
export const headers = header;
export const Headers = header;


/**
 * Inject http request body
 *
 * @param key req.body | req.body[key]
 */
export const body = (key?: string) => decoratorFactory(symbols.INJECTORS.BODY, [], (injectedParam: any) => {
  if (typeof injectedParam === 'undefined' || !key) {
    return injectedParam;
  } else {
    return pipe(
      key.split('.').filter(k => !!k),
      A.reduce<string, any>(injectedParam, (r: any, k: string) => r && r[k]) ?? {},
    );
  }
});
export const Body = body;

/**
 * Inject http cookie value
 */
export const cookieValue = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.COOKIE, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  });
export const CookieValue = cookieValue;

/**
 * Inject http session value
 */
export const sessionValue = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.SESSION, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  });
export const SessionValue = sessionValue;

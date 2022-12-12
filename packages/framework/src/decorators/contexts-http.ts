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
 * Inject http query
 */
export const Query = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.QUERY, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  });

/**
 * Inject http request params
 */
export const Params = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.PARAMS, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  });

/**
 * Inject http request headers
 */
export const Header = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.HEADERS, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key.toLowerCase()] ?? defaultValue;
    }
  });
export const Headers = Header;


/**
 * Inject http request body
 *
 * @param key req.body | req.body[key]
 */
export const Body = (key?: string) => decoratorFactory(symbols.INJECTORS.BODY, [], (injectedParam: any) => {
  if (typeof injectedParam === 'undefined' || !key) {
    return injectedParam;
  } else {
    return pipe(
      key.split('.').filter(k => !!k),
      A.reduce<string, any>(injectedParam, (r: any, k: string) => r && r[k]) ?? {},
    );
  }
});

/**
 * Inject http cookie value
 */
export const CookieValue = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.COOKIE, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  });

/**
 * Inject http session value
 */
export const SessionValue = (key?: string, defaultValue?: any) =>
  decoratorFactory(symbols.INJECTORS.SESSION, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  });

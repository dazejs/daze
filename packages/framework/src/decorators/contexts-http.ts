import * as symbols from '../symbol';
import { A, pipe } from './helpers';
import { createInjectDecorator } from './factory/create-inject-decorator';

/**
 * Inject original http request
 */
export const originalReq = () => createInjectDecorator(symbols.INJECTORS.REQ);
export const req = originalReq;

/**
 * Inject original http response
 */
export const originalRes = () => createInjectDecorator(symbols.INJECTORS.RES);
export const res = originalRes;

/**
 * Inject daze http request
 */
export const request = () => createInjectDecorator(symbols.INJECTORS.REQUEST);

/**
 * Inject daze http response
 */
export const response = () => createInjectDecorator(symbols.INJECTORS.RESPONSE);

/**
 * Inject http query
 */
export const query = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.QUERY, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  });

/**
 * Inject http request params
 */
export const params = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.PARAMS, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  });

/**
 * Inject http request headers
 */
export const header = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.HEADERS, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key.toLowerCase()] ?? defaultValue;
    }
  });
export const headers = header;

/**
 * Inject http request body
 *
 * @param key req.body | req.body[key]
 */
export const body = (key?: string) => createInjectDecorator(symbols.INJECTORS.BODY, [], (injectedParam: any) => {
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
export const cookieValue = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.COOKIE, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  });

/**
 * Inject http session value
 */
export const sessionValue = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.SESSION, [], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  });

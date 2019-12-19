import * as symbols from '../symbol';
import { A, pipe } from './helpers';
import { createInjectDecorator } from './factory/create-inject-decorator';

/**
 * Inject original http request
 */
export const OriginalReq = createInjectDecorator(symbols.INJECTORS.REQ);
export const Req = OriginalReq;
export const originalReq = OriginalReq;
export const req = OriginalReq;

/**
 * Inject original http response
 */
export const OriginalRes = createInjectDecorator(symbols.INJECTORS.RES);
export const Res = OriginalRes;
export const originalRes = OriginalRes;
export const res = OriginalRes;

/**
 * Inject daze http request
 */
export const Request = createInjectDecorator(symbols.INJECTORS.REQUEST);
export const request = Request;

/**
 * Inject daze http response
 */
export const Response = createInjectDecorator(symbols.INJECTORS.RESPONSE);
export const response = Response;

/**
 * Inject http query
 */
export const Query = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.QUERY, (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  }).call([]);
export const query = Query;

/**
 * Inject http request params
 */
export const Params = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.PARAMS, (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key] ?? defaultValue;
    }
  }).call([]);
export const params = Params;

/**
 * Inject http request headers
 */
export const Header = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.HEADERS, (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam[key.toLowerCase()] ?? defaultValue;
    }
  }).call([]);
export const header = Header;
export const Headers = Header;
export const headers = Header;

/**
 * Inject http request body
 *
 * @param key req.body | req.body[key]
 */
export const Body = (key?: string) => createInjectDecorator(symbols.INJECTORS.BODY, (injectedParam: any) => {
  if (typeof injectedParam === 'undefined' || !key) {
    return injectedParam;
  } else {
    return pipe(
      key.split('.').filter(k => !!k),
      A.reduce<string, any>(injectedParam, (r: any, k: string) => r && r[k]) ?? {},
    );
  }
}).call([]);
export const body = Body;

/**
 * Inject http cookie value
 */
export const CookieValue = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.COOKIE, (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  }).call([]);
export const cookieValue = CookieValue;

/**
 * Inject http session value
 */
export const SessionValue = (key?: string, defaultValue?: any) =>
  createInjectDecorator(symbols.INJECTORS.SESSION, (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key) ?? defaultValue;
    }
  }).call([]);
export const sessionValue = SessionValue;

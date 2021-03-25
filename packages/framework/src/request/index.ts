/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import accepts from 'accepts';
import Cookies from 'cookies';
import * as http from 'http';
import parse from 'parseurl';
import * as qs from 'querystring';
import { is as typeIs } from 'type-is';

import { Container } from '../container';
import { ValidateHttpError } from '../errors/validate-http-error';
import { Application } from '../foundation/application';
import { Session } from '../session';
import { Validate } from '../validate';
import { parseBody } from './utils/parse-body';
import { Files } from 'formidable';


export interface BodyData {
  fields?: { [key: string]: any } | string;
  files?: Files;
}

export class Request {
  /**
   * application
   */
  app: Application = Container.get('app');

  /**
   * request req
   */
  req: http.IncomingMessage;

  /**
   * response res
   */
  res: http.ServerResponse;

  /**
   * cookies instance cache
   */
  _cookies: Cookies;

  /**
   * session instance cache
   */
  _session: Session;

  /**
   * accepts cache
   */
  _accepts: accepts.Accepts;

  /**
   * request body cache
   */
  _body: BodyData;

  /**
   * request params cache
   */
  _params: { [key: string]: any };

  [key: string]: any
  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    this.req = req;
    this.res = res;

    /**
     * proxy instance
     */
    return new Proxy(this, this.proxy());
  }

  /**
   * get proxy handler
   */
  private proxy(): ProxyHandler<this> {
    return {
      get(t, prop, receiver) {
        if (Reflect.has(t, prop) || typeof prop !== 'string') {
          return Reflect.get(t, prop, receiver);
        }
        return t.getParam(prop);
      },
    };
  }

  /**
   * initialize request
   */
  async initialize() {
    // init body
    if (this.app.needsParseBody) {
      this._body = await parseBody(this);
    };
    // init session
    if (this.app.needsSession) {
      await this.session().loadSession();
    };
  }

  /**
   * Return request header.
   */
  get headers() {
    return this.req.headers;
  }

  /**
   * Return request header.
   */
  getHeaders() {
    return this.headers;
  }

  /**
   * Return request header.
   */
  getHeader(name: string) {
    if (!name) return '';
    const field = name.toLowerCase();
    switch (field) {
      case 'referer':
      case 'referrer':
        return this.req.headers.referrer || this.req.headers.referer || '';
      default:
        return this.req.headers[field] || '';
    }
  }

  /**
   * Return request header.
   */
  get(name: string) {
    return this.getHeader(name);
  }

  /**
   * Get request method.
   */
  get method() {
    return this.req.method || '';
  }

  /**
   * Get request method.
   */
  getMethod() {
    return this.method;
  }

  /**
   * check if the request method is OPTIONS
   */
  isOptions() {
    return this.method === 'OPTIONS';
  }

  /**
   * check if the request method is HEAD
   */
  isHead() {
    return this.method === 'HEAD';
  }

  /**
   * check if the request method is GET
   */
  isGet() {
    return this.method === 'GET';
  }

  /**
   * check if the request method is POST
   */
  isPost() {
    return this.method === 'POST';
  }

  /**
   * check if the request method is PUT
   */
  isPut() {
    return this.method === 'PUT';
  }

  /**
   * check if the request method is PATCH
   */
  isPatch() {
    return this.method === 'PATCH';
  }

  /**
   * check if the request method is DELETE
   */
  isDelete() {
    return this.method === 'DELETE';
  }

  /**
   * Get parsed Content-Length when present.
   */
  get length() {
    const len = this.getHeader('Content-Length');
    if (!len) return undefined;
    return Number(len) | 0; // eslint-disable-line no-bitwise
  }

  /**
   * Get parsed Content-Length when present.
   */
  getLength() {
    return this.length;
  }

  getIps() {
    const proxy = this.app.get('config').get('app.proxy');
    if (proxy) {
      const ips = this.getHeader('X-Forwarded-For') as string;
      return ips.split(/\s*,\s*/);
    }
    return [];
  }

  getIp() {
    return this.getIps()[0] || this.getSocket().remoteAddress || ''; 
  }

  /**
   * Get request URL.
   */
  get url() {
    return this.req.url;
  }

  /**
   * Get request URL.
   */
  getUrl() {
    return this.url;
  }

  /**
   * Get request socket
   */
  get socket() {
    return this.req.socket;
  }

  /**
   * Get request socket
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Get request protocol
   */
  get protocol() {
    // eslint-disable-next-line
    // @ts-ignore
    if (this.socket.encrypted) return 'https';
    const proxy = this.app.get('config').get('app.proxy');
    if (!proxy) return 'http';
    const xForwordedProto = this.getHeader('X-Forwarded-Proto') as string;
    return xForwordedProto ? xForwordedProto.split(/\s*,\s*/, 1)[0] : 'http';
  }

  /**
   * Get request protocol
   */
  getProtocol() {
    return this.protocol;
  }

  /**
   * get request host
   */
  get host() {
    let host;
    const proxy = this.app.get('config').get('app.proxy');
    if (proxy) host = this.getHeader('X-Forwarded-Host') as string;
    if (!host) {
      if (this.isHttp2) host = this.getHeader(':authority') as string;
      if (!host) host = this.getHeader('Host') as string;
    }
    return host ? host.split(/\s*,\s*/, 1)[0] : '';
  }


  /**
   * get request host
   */
  getHost() {
    return this.host;
  }

  /**
   * Get request origin
   */
  get origin() {
    return `${this.protocol}://${this.host}`;
  }

  /**
   * Get request origin
   */
  getOrigin() {
    return this.origin;
  }

  /**
   * Get request href
   */
  get href() {
    if (this.url && /^https?:\/\//i.test(this.url)) return this.url;
    return this.origin + this.url;
  }

  /**
   * Get request href
   */
  getHref() {
    return this.href;
  }

  /**
   * Get request Path
   */
  get path() {
    const parsedReq = parse(this.req);
    return parsedReq && parsedReq.pathname || '';
  }

  /**
   * Get request Path
   */
  getPath() {
    return this.path;
  }

  /**
   * 根据 ? 获取原始查询字符串（不包含 ?）
   */
  get querystring(): any {
    const parsedReq = parse(this.req);
    return parsedReq && parsedReq.query || '';
  }

  /**
   * 根据 ? 获取原始查询字符串
   */
  getQuerystring() {
    return this.querystring;
  }


  /**
   * 根据 ? 获取原始查询字符串（包含 ?）
   */
  get search() {
    if (!this.querystring) return '';
    return `?${this.querystring}`;
  }

  /**
   * 根据 ? 获取原始查询字符串（包含 ?）
   */
  getSearch() {
    return this.search;
  }

  /**
   * 获取解析的查询字符串, 当没有查询字符串时，返回一个空对象
   */
  get query() {
    const str = this.querystring;
    return qs.parse(str);
  }

  /**
   * 获取解析的查询字符串, 当没有查询字符串时，返回一个空对象
   */
  getQuery(key?: string) {
    return key ? this.query[key] : this.query;
  }

  /**
   * Get the request mime type
   */
  get type() {
    const type = this.getHeader('Content-Type') as string;
    if (!type) return '';
    return type.split(';')[0];
  }

  /**
   * Get the request mime type
   */
  getType() {
    return this.type;
  }

  /**
   * Get accept object
   */
  get accepts() {
    if (!this._accepts) this._accepts = accepts(this.req);
    return this._accepts;
  }

  /**
   * Return the types that the request accepts,
   * in the order of the client's preference (most preferred first).
   */
  acceptsTypes(...params: string[]) {
    return this.accepts.types(...params);
  }

  /**
   * Return the first accepted encoding.
   * If nothing in encodings is accepted, then false is returned.
   */
  acceptsEncodings(...params: string[]) {
    return this.accepts.encodings(...params);
  }

  /**
   * Return the first accepted charset.
   * If nothing in charsets is accepted, then false is returned.
   */
  acceptsCharsets(...params: string[]) {
    return this.accepts.charsets(...params);
  }

  /**
   * Return the first accepted language.
   * If nothing in languages is accepted, then false is returned.
   */
  acceptsLanguages(...params: string[]) {
    return this.accepts.languages(...params);
  }

  /**
   * get the cookie instance
   */
  get cookies() {
    if (!this._cookies) {
      this._cookies = new Cookies(this.req, this.res, {
        keys: this.app.keys,
        secure: this.secure,
      });
    }
    return this._cookies;
  }

  /**
   * return cookie val by name
   */
  cookie(key: string, options: any = {}) {
    return this.cookies.get(key, options);
  }

  /**
   * alias this.cookie
   */
  cookieValue(key: string, options: any = {}) {
    return this.cookie(key, options);
  }

  /**
   * session simple
   * @param {String} key session key
   * @param {*} value session value
   */
  session() {
    if (!this._session) {
      this._session = new Session(this);
    }
    // if (key && !value) return this._session.get(key);
    // if (key && value) return this._session.set(key, value);
    return this._session;
  }

  /**
   * get Session value
   */
  sessionValue(key: string) {
    return this.session().get(key);
  }

  get secure() {
    return this.protocol === 'https';
  }

  is(...types: any[]) {
    return typeIs(this.getHeader('content-type') as string, types);
  }

  /**
   * Determine if the http Version is 2.0
   */
  get isHttp2() {
    return this.req.httpVersionMajor >= 2;
  }

  /**
   * Determine if the request is the result of an AJAX call.
   */
  get isAjax() {
    const x = this.headers['x-requested-with'] as string;
    if (x && x.toLowerCase() === 'xmlhttprequest') {
      return true;
    }
    return false;
  }

  get mergedParams() {
    if (!this._params) {
      if (typeof this.body === 'string') {
        this._params = {
          ...this.query,
          body: this.body,
        };
      } else {
        this._params = {
          ...this.query,
          ...this.body,
        };
      }
    }
    return this._params;
  }

  /**
   * request body params getter
   */
  get body() {
    return this._body && this._body.fields || {};
  }

  /**
   * get request body params
   */
  getBody() {
    return this.body;
  }
  /**
   * request files getter
   */
  get files() {
    return this._body && this._body.files || [];
  }

  /**
   * get request files
   */
  getFiles() {
    return this.files;
  }

  /**
   * Gets the parameter value based on the parameter name
   * Returns the default value when the parameter does not exist
   */
  getParam(name: string, defaultValue?: any) {
    if (!name) return undefined;
    return this.hasParam(name) ? this.mergedParams[name] : defaultValue;
  }

  /**
   * get all params
   */
  getParams() {
    return this.mergedParams;
  }

  /**
   * Filter parameters
   */
  only(...args: any[]) {
    const res: any = {};
    for (const arg of args) {
      if (typeof arg === 'string') {
        if (this.hasParam(arg)) {
          res[arg] = this.getParam(arg);
        }
      } else if (Array.isArray(arg)) {
        for (const name of arg) {
          if (this.hasParam(name)) {
            res[name] = this.getParam(name);
          }
        }
      }
    }
    return res;
  }


  /**
   * Filter parameters
   */
  except(...args: any[]) {
    let exceptKeys: any[] = [];
    let keys = Object.keys(this.mergedParams);
    for (const arg of args) {
      if (typeof arg === 'string') {
        exceptKeys.push(arg);
      } else if (Array.isArray(arg)) {
        exceptKeys = exceptKeys.concat(arg);
      }
    }
    keys = keys.filter(key => !~exceptKeys.indexOf(key)); // eslint-disable-line
    return this.only(keys);
  }

  /**
   * Determine whether the parameter exists
   */
  hasParam(name: string) {
    return Reflect.has(this.mergedParams, name);
  }

  /**
   * validate request
   */
  validate(validator: any, message = 'Validation error') {
    const validate = new Validate(validator);
    if (!validate.check(this.mergedParams)) {
      throw new ValidateHttpError(message, validate);
    }
  }
}

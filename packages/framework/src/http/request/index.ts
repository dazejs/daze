/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import accepts from 'accepts';
import Cookies from 'cookies';
import http from 'http';
import parse from 'parseurl';
import * as qs from 'querystring';
import { is as typeIs } from 'type-is';
import { URL } from 'url';
import { v1 } from 'uuid';
import { Container } from '../../container';
import { ValidateHttpError } from '../../errors/validate-http-error';
import { Application } from '../../foundation/application';
import { Validate } from '../../validate';
import { Route } from '../router/route';
import { Session } from '../session';
import { parseBody } from './utils/parse-body';

export interface BodyData {
  fields?: any;
  files?: any;
}


/**
 * Request
 */
export class Request {
  /**
     * application instance
     */
  private app: Application = Container.get('app');

  /**
     * request params cache
     */
  private _params: { [key: string]: any };

  /**
     * request body cache
     */
  private _body: BodyData;

  /**
     * cookies instance cache
     */
  private _cookies: Cookies;

  /**
     * session instance cache
     */
  private _session: Session;


  /**
     * request req
     */
  private _req: http.IncomingMessage;

  /**
     * response res
     */
  private _res: http.ServerResponse;

  /**
     * 缓存的 URL 对象
     */
  private _cachedURL?: URL;

  /**
     * accepts cache
     */
  private _accepts?: accepts.Accepts;

  /**
     * route
     */
  private _route?: Route;

  /**
     * uuid
     */
  private _uuid = v1();

  /**
     * 原始 url
     */
  private _originUrl: string;

  [key: string]: any

  /**
     * 请求类型构造函数
     * @param 
     */
  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    this._req = req;
    this._res = res;

    this._originUrl = this.url;
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

  async initialize(route?: Route) {
    this._route = route;
    // init body
    if (this.app.needsParseBody) {
      this._body = await parseBody(this);
    }
    // init session
    if (this.app.needsSession) {
      await this.session().loadSession();
    }
  }

  getUUID() {
    return this._uuid;
  }

  get req() {
    return this._req;
  }

  get res() {
    return this._res;
  }

  getReq() {
    return this._req;
  }

  getRes() {
    return this._res;
  }

  get body() {
    return this._body?.fields ?? {};
  }

  getBody() {
    return this.body;
  }

  get routeParams() {
    return this._route?.getParams(this.path);
  }

  getRouteParams() {
    return this.routeParams;
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
     * Determine if the http Version is 2.0
     */
  get isHttp2() {
    return this._req.httpVersionMajor >= 2;
  }

  /**
     * 获取所有请求头
     */
  get header() {
    return this._req.headers;
  }

  /**
     * 获取所有请求头
     */
  get headers() {
    return this._req.headers;
  }

  /**
     * 覆盖所有请求头
     */
  set headers(val: any) {
    this._req.headers = val;
  }

  /**
     * 设置所有请求头
     * 不会全量覆盖
     * @param val 
     * @returns 
     */
  setHeaders(val: object) {
    this.headers = {
      ...this.headers,
      ...val
    };
    return this;
  }

  /**
     * 获取当前 url
     */
  get url() {
    return this._req.url??'';
  }

  set url(val: string) {
    this._req.url = val;
  }

  /**
     * 获取原始 url
     * 无论 url 如何设置
     */
  get originUrl() {
    return this._originUrl || '';
  }
    
  /**
     * 获取当前 url
     * @returns 
     */
  getUrl() {
    return this.url;
  }

  setUrl(val: string) {
    this.url = val;
    return this;
  }

  /**
     * 获取请求 origin
     */
  get origin() {
    return `${this.protocol}://${this.host}`;
  }

  /**
     * 获取请求 origin
     */   
  getOrigin() {
    return this.origin;
  }

  /**
     * 获取请求 href
     */
  get href() {
    if (this.url && /^https?:\/\//i.test(this.url)) return this.url;
    return this.origin + this.url;
  }

  /**
     * 获取请求 href
     * @returns 
     */
  getHref() {
    return this.href;
  }

  /**
     * 获取请求方法
     */
  get method() {
    return this._req.method;
  }

  /**
     * 获取请求方法
     * @returns 
     */
  getMethod() {
    return this.method;
  }

  /**
     * 获取请求 path
     */
  get path() {
    const parsedReq = parse(this._req);
    return parsedReq && parsedReq.pathname || '';
  }

  /**
     * 获取请求 path
     * @returns 
     */
  getPath() {
    return this.path;
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
     * @returns 
     */
  getQuery() {
    return this.query;
  }

  /**
     * 根据 ? 获取原始查询字符串（不包含 ?）
     */
  get querystring(): any {
    const parsedReq = parse(this._req);
    return parsedReq && parsedReq.query || '';
  }

  /**
     * 根据 ? 获取原始查询字符串（不包含 ?）
     * @returns 
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
     * @returns 
     */
  getSearch() {
    return this.search;
  }

  /**
     * 请求 Host
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
     * 请求 Host
     * @returns 
     */
  getHost() {
    return this.host;
  }

  /**
     * 请求 Hostname
     */
  get hostname () {
    const host = this.host;
    if (!host) return '';
    if (host[0] === '[') return this.URL?.hostname ?? ''; // IPv6
    return host.split(':', 1)[0];
  }

  /**
     * 请求 Hostname
     * @returns 
     */
  getHostname() {
    return this.hostname;
  }

  /**
     * 获取 WHATWG 格式 URL
     */
  get URL() {
    if (this._cachedURL) return this._cachedURL;
    try {
      this._cachedURL = new URL(`${this.origin}${this.url}`);
    } catch (err) {
      this._cachedURL = Object.create(null);
    }
    return this._cachedURL;
  }

  /**
     * 获取 WHATWG 格式 URL
     * @returns 
     */
  getURL() {
    return this.URL;
  }

  /**
     * 获取 socket
     */
  get socket() {
    return this._req.socket;
  }

  /**
     * 获取 socket
     * @returns 
     */
  getSocket() {
    return this.socket;
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
     * 是否安全 https
     */
  get secure() {
    return this.protocol === 'https';
  }

  /**
     * 是否安全 https
     * @returns 
     */
  getSecure() {
    return this.secure;
  }

  /**
     * 获取 ip 列表
     */
  get ips() {
    const proxy = this.app.get('config').get('app.proxy');
    if (proxy) {
      const ips = this.getHeader('X-Forwarded-For') as string;
      return ips.split(/\s*,\s*/);
    }
    return [];
  }

  /**
     * 获取 ip 列表
     * @returns 
     */
  getIps() {
    return this.ips;
  }

  /**
     * 获取请求 IP
     */
  get ip() {
    return this.getIps()[0] || this.getSocket().remoteAddress || ''; 
  }

  /**
     * 获取请求 IP
     * @returns 
     */
  getIp() {
    return this.ip;
  }

  /**
     * Get accept object.
     */
  get accept() {
    return this._accepts || (this._accepts = accepts(this._req));
  }

  /**
     * Get accept object.
     * @returns 
     */
  getAccept() {
    return this.accept;
  }

  /**
   * Get accept object
   */
  accepts(...params: string[]) {
    return this.acceptsTypes(...params);
  }

  /**
   * Return the types that the request accepts,
   * in the order of the client's preference (most preferred first).
   */
  acceptsTypes(...params: string[]) {
    return this.accept.types(...params);
  }

  /**
     * Return the first accepted encoding.
     * If nothing in encodings is accepted, then false is returned.
     */
  acceptsEncodings(...params: string[]) {
    return this.accept.encodings(...params);
  }

  /**
     * Return the first accepted charset.
     * If nothing in charsets is accepted, then false is returned.
     */
  acceptsCharsets(...params: string[]) {
    return this.accept.charsets(...params);
  }

  /**
     * Return the first accepted language.
     * If nothing in languages is accepted, then false is returned.
     */
  acceptsLanguages(...params: string[]) {
    return this.accept.languages(...params);
  }

  /**
     * Check if the incoming request contains the "Content-Type"
     * header field and if it contains any of the given mime `type`s.
     * If there is no request body, `null` is returned.
     * If there is no content type, `false` is returned.
     * Otherwise, it returns the first `type` that matches.
     *
     * Examples:
     *
     *     // With Content-Type: text/html; charset=utf-8
     *     this.is('html'); // => 'html'
     *     this.is('text/html'); // => 'text/html'
     *     this.is('text/*', 'application/json'); // => 'text/html'
     *
     *     // When Content-Type is application/json
     *     this.is('json', 'urlencoded'); // => 'json'
     *     this.is('application/json'); // => 'application/json'
     *     this.is('html', 'application/*'); // => 'application/json'
     *
     *     this.is('html'); // => false
     */
  is(...types: any[]) {
    return typeIs(this.getHeader('content-type') as string, types);
  }

  /**
     * 获取请求头, 如果没有设置字段值，返回空字符串
     *
     * 特殊字段 `Referrer`和 `Referrer` 和 `Referer` 是可替换的
     *
     * 示例:
     *
     *     this.get('Content-Type');
     *     // => "text/plain"
     *
     *     this.get('content-type');
     *     // => "text/plain"
     *
     *     this.get('Something');
     *     // => ''
     */
  get(name: string) {
    if (!name) return '';
    const field = name.toLowerCase();
    switch (field) {
      case 'referer':
      case 'referrer':
        return this._req.headers.referrer || this._req.headers.referer || '';
      default:
        return this._req.headers[field] || '';
    }
  }

  /**
     * request.get() 的别名
     *
     * 获取请求头, 如果没有设置字段值，返回空字符串
     *
     * 特殊字段 `Referrer`和 `Referrer` 和 `Referer` 是可替换的
     *
     * 示例:
     *
     *     this.get('Content-Type');
     *     // => "text/plain"
     *
     *     this.get('content-type');
     *     // => "text/plain"
     *
     *     this.get('Something');
     *     // => ''
     */
  getHeader(field: string) {
    return this.get(field);
  }

  getHeaders() {
    return this.headers;
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

  get cookies() {
    if (!this._cookies) {
      this._cookies = new Cookies(this._req, this._res, {
        keys: this.app.keys,
        secure: this.secure,
      });
    }
    return this._cookies;
  }

  cookieValue(key: string, options?: any) {
    return this.cookies.get(key, options);
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
    return this._session;
  }

  /**
     * get Session value
     */
  sessionValue(key: string) {
    return this.session().get(key);
  }

  get isAjax() {
    const x = this.headers['x-requested-with'] as string;
    if (x && x.toLowerCase() === 'xmlhttprequest') {
      return true;
    }
    return false;
  }

  /**
     * 检查请求方法是否为 options
     */
  isOptions() {
    return this.method === 'OPTIONS';
  }

  /**
     * 检查请求方法是否为 head
     */
  isHead() {
    return this.method === 'HEAD';
  }

  /**
     * 检查请求方法是否为 get
     */
  isGet() {
    return this.method === 'GET';
  }

  /**
     * 检查请求方法是否为 post
     */
  isPost() {
    return this.method === 'POST';
  }

  /**
     * 检查请求方法是否为 put
     */
  isPut() {
    return this.method === 'PUT';
  }

  /**
     * 检查请求方法是否为 patch
     */
  isPatch() {
    return this.method === 'PATCH';
  }

  /**
     * 检查请求方法是否为 delete
     */
  isDelete() {
    return this.method === 'DELETE';
  }

  private get mergedParams() {
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
     * 获取基于参数名称的参数值
     * 当参数不存在时返回默认值
     */
  getParam(name: string, defaultValue?: any) {
    if (!name) return undefined;
    return this.hasParam(name) ? this.mergedParams[name] : defaultValue;
  }

  /**
     * 得到所有参数
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
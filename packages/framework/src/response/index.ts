/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import assert from 'assert'
import statuses from 'statuses'
import getType from 'cache-content-type'
import Stream from 'stream'
import { extname } from 'path'
import is from 'core-util-is'
import contentDisposition from 'content-disposition'
import { Resource} from '../resource/resource'
import { ViewFactory } from '../view/factory'
import { IllegalArgumentError } from '../errors/illegal-argument-error'
import { View } from '../view'
import { Cookie } from '../cookie'
import { Statusable } from './statusable'
import { OutgoingHttpHeaders } from 'http'

export class Response extends Statusable {

  /**
   * response statusCode
   */
  protected _code: number;

  /**
   * response Header
   */
  protected _header: OutgoingHttpHeaders;

  /**
   * response data
   */
  protected _data: { [key: string]: any };

  /**
   * response cookies
   */
  protected cookies: Cookie[] = [];

  /**
   * is static server
   */
  protected _isStaticServer = false;

  /**
   * patched methods
   */
  [key: string]: any;
  constructor(data: any = null, code = 200, header = {}) {
    super()
    /**
     * status code
     * @type
     */
    this._code = code;

    /**
     * http headers
     * @type
     */
    this._header = this.parseHeaders(header);

    /**
     * original data
     * @type
     */
    this._data = data;
  }

  /**
   * code setter
   */
  set code(code) {
    this.setCode(code);
  }

  /**
   * code getter
   */
  get code() {
    return this._code;
  }

  /**
   * data setter
   */
  set data(data) {
    this.setData(data);
  }

  /**
   * data getter
   */
  get data() {
    return this._data;
  }

  staticServer() {
    this._isStaticServer = true;
    return this;
  }

  /**
   * parse init headers
   * @param headers
   */
  private parseHeaders(headers: OutgoingHttpHeaders) {
    assert(is.isObject(headers), new IllegalArgumentError('header name must be object'));
    const keys = Object.keys(headers);
    const _headers: OutgoingHttpHeaders = {};
    for (const key of keys) {
      _headers[key.toLocaleLowerCase()] = headers[key];
    }
    return _headers;
  }

  /**
   * throw http exception with code and message
   * @param message exception message
   * @param code exception code
   */
  error(message: any, code: number = 404) {
    this.setCode(code);
    this.setData(message);
    return this;
  }

  /**
   * set success data in ctx.body
   * @param  data data
   * @param code http code
   */
  success(data: any, code: number = 200) {
    this.setCode(code);
    this.setData(data);
    return this;
  }

  /**
   * get http header
   */
  getHeader(name: string) {
    assert(is.isString(name), new IllegalArgumentError('header name must be string'));
    return this._header[name.toLowerCase()];
  }

  /**
   * Set response header
   * The original response headers are merged when the name is passed in as object
   *
   * @param name Response header parameter name
   * @param value Response header parameter value
   */
  setHeader(name: any, value: any) {
    assert(is.isString(name), new IllegalArgumentError('header name must be string'));
    this._header[name.toLowerCase()] = value;
    return this;
  }

  /**
   * getHeader alias
   * @public
   */
  getHeaders() {
    return this._header;
  }

  /**
   * setHeader alias
   * @public
   */
  setHeaders(headers: any) {
    assert(is.isObject(headers), new IllegalArgumentError('header name must be object'));
    const keys = Object.keys(headers);
    for (const key of keys) {
      this.setHeader(key.toLowerCase(), headers[key]);
    }
    return this;
  }

  /**
   * get http code
   * @public
   */
  getCode() {
    return this.code;
  }

  /**
   * getCode alias
   * @public
   */
  getStatus() {
    return this.getCode();
  }

  /**
   * set code
   * @public
   * @param code status
   */
  setCode(code: number = 200) {
    if (code) this._code = code;
    return this;
  }

  /**
   * setCode alias
   * @public
   * @param code status
   */
  setStatus(code: number) {
    return this.setCode(code);
  }

  /**
   * get return data
   * @public
   */
  getData() {
    return this._data;
  }

  /**
   * Set the returned data
   * @public
   * @param data Returned data
   */
  setData(data: any) {
    if (data) this._data = data;
    return this;
  }

  /**
   * set content-type
   * @param type 
   */
  setType(type: string) {
    const _type = getType(type);
    if (_type) {
      this.setHeader('Content-Type', _type);
    }
    return this;
  }

  /**
   * set length header
   * @param length 
   */
  setLength(length: number) {
    this.setHeader('Content-Length', length);
    return this;
  }

  /**
   * set vary header
   * @param field 
   */
  setVary(field: string) {
    const varyHeader = this.getHeader('Vary') || '';
    const varys = String(varyHeader).split(',');
    varys.push(field);
    this.setHeader('Vary', varys.filter((v: string) => !!v).join(','));
  }

  /**
   * LastModified
   * @public
   * @param time time
   * @returns this
   */
  lastModified(time: string | Date | number) {
    if (time instanceof Date) {
      this.setHeader('Last-Modified', time.toUTCString());
      return this;
    }
    if (typeof time === 'string' || typeof time === 'number') {
      this.setHeader('Last-Modified', (new Date(time)).toUTCString());
      return this;
    }
    return this;
  }

  /**
   * Expires
   * @param time time
   */
  expires(time: string) {
    this.setHeader('Expires', time);
    return this;
  }

  /**
   * ETag
   * @param eTag eTag
   */
  eTag(eTag: string) {
    if (!/^(W\/)?"/.test(eTag)) {
      this.setHeader('ETag', `"${eTag}"`);
      return this;
    }
    this.setHeader('ETag', eTag);
    return this;
  }

  /**
   * CacheControl
   * @param cache cache setting
   */
  cacheControl(cache: string) {
    this.setHeader('Cache-Control', cache);
    return this;
  }

  /**
   * Set the page to do no caching
   * @public
   */
  noCache() {
    this.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    this.setHeader('Pragma', 'no-cache');
    return this;
  }

  /**
   * ContentType
   * @public
   * @param contentType The output type
   * @param charset The output of language
   */
  contentType(contentType: string, charset = 'utf-8') {
    this.setHeader('Content-Type', `${contentType}; charset=${charset}`);
    return this;
  }

  /**
   * Contents-dispositions are set as "attachments" to indicate that the client prompts to download.
   * Optionally, specify the filename to be downloaded.
   * @public
   * @param filename
   * @returns this
   */
  attachment(filename: string = '', options: any) {
    if (filename) this.type = extname(filename);
    this.setHeader('Content-Disposition', contentDisposition(filename, options));
    return this;
  }

  /**
   * attachment alias
   * @public
   * @param filename
   */
  download(data: any, filename: string = '', options: any) {
    return this.setData(data).attachment(filename, options);
  }

  /**
   * handle Resource data
   */
  handleData(request: any) {
    const data = this.getData();
    if (data instanceof Resource) {
      return data.output();
    }
    if (data instanceof View) {
      return (new ViewFactory(data)).output(request);
    }
    return this.prepareData(data);
  }

  /**
   * response with cookie instance
   * @param _cookie
   */
  withCookie(_cookie: any) {
    if (_cookie instanceof Cookie) {
      this.cookies.push(_cookie);
    }
    return this;
  }

  /**
   * response with cookie
   * @param key
   * @param value
   * @param options
   */
  cookie(key: string, value: any, options: any = {}) {
    this.withCookie(new Cookie(key, value, options));
    return this;
  }

  /**
   * set json response type
   */
  json() {
    this.setType('json');
    return this;
  }

  /**
   * set html response type
   */
  html() {
    this.setType('html');
    return this;
  }

  /**
   * set html response type
   */
  text() {
    this.setType('text');
    return this;
  }

  async commitCookies(request: any) {
    for (const _cookie of this.cookies) {
      request.cookies.set(_cookie.getName(), _cookie.getValue(), _cookie.getOptions());
    }
    await request.session().autoCommit();
  }

  prepareData(data: any) {
    const shouldSetType = !this.getHeader('content-type');
    if (Buffer.isBuffer(data)) {
      if (shouldSetType) this.setType('bin');
      this.setLength(data.length);
    } else if (typeof data === 'string') {
      if (shouldSetType) this.setType(/^\s*</.test(data) ? 'html' : 'text');
      this.setLength(Buffer.byteLength(data));
    } else if (data instanceof Stream) {
      if (shouldSetType) this.setType('bin');
    } else {
      this.setType('json');
    }
    return data;
  }

  /**
   * send data
   * @param request
   * @public
   */
  async send(request: any) {
    const data = this.handleData(request);

    const { req, res } = request;

    // headers
    if (!res.headersSent) {
      const headers = this.getHeaders();
      const code = this.getCode();

      res.statusCode = code;
      if (req.httpVersionMajor < 2) {
        res.statusMessage = statuses[code];
      }

      for (const key of Object.keys(headers)) {
        res.setHeader(key, headers[key]);
      }
    }

    if (Buffer.isBuffer(data) || typeof data === 'string') {
      return res.end(data);
    }

    if (data instanceof Stream) {
      return data.pipe(res);
    }

    // json
    const jsonData = JSON.stringify(data);
    if (!res.headersSent) {
      res.setHeader('Content-Length', Buffer.byteLength(jsonData));
    }

    res.end(jsonData);
    return undefined;
  }
}

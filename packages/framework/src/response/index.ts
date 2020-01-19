/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import getType from 'cache-content-type';
import contentDisposition from 'content-disposition';
import { OutgoingHttpHeaders, ServerResponse } from 'http';
import { extname } from 'path';
import compressible from 'compressible';
import { Container } from '../container';
import { Cookie } from '../cookie';
import { Application } from '../foundation/application';
import { Request } from '../request';
import { Resource } from '../resource/resource';
import { View } from '../view';
import { ViewFactory } from '../view/factory';
import { Statusable } from './statusable';
import { Stream } from 'stream';
import * as zlib from 'zlib';

const encodingMethods = {
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate
};

// import statuses from 'statuses'
// import { IllegalArgumentError } from '../errors/illegal-argument-error'
const defaultContentTypes = {
  JSON: 'application/json; charset=utf-8',
  PLAIN: 'text/plain; charset=utf-8',
  OCTET: 'application/octet-stream'
};

export class Response extends Statusable {
  /**
   * application
   */
  protected app: Application = Container.get('app');

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
  protected _data: any;

  /**
   * response cookies
   */
  protected cookies: Cookie[] = [];

  /**
   * patched methods
   */
  // [key: string]: any;
  constructor(data?: any, code = 200, header: OutgoingHttpHeaders = {}) {
    super();
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
     * init data
     */
    this.setData(data);
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

  /**
   * parse init headers
   * @param headers
   */
  private parseHeaders(headers: OutgoingHttpHeaders) {
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
  error(message: any, code = 404) {
    this.setCode(code);
    this.setData(message);
    return this;
  }

  /**
   * set success data in ctx.body
   * @param  data data
   * @param code http code
   */
  success(data: any, code = 200) {
    this.setCode(code);
    this.setData(data);
    return this;
  }

  /**
   * get http header
   */
  getHeader(name: string) {
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
    this._header[name.toLowerCase()] = value;
    return this;
  }

  /**
   * remove header from response
   * @param name 
   */
  removeHeader(name: any) {
    delete this._header[name.toLowerCase()];
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
  setCode(code = 200) {
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
   * get content type
   */
  getType() {
    const type = this.getHeader('Content-Type') as string;
    if (!type) return '';
    return type.split(';', 1)[0];
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
   * get response data length
   */
  getLength() {
    const length = this.getHeader('Content-Length') as string;
    return length ? parseInt(length, 10) : 0;
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
  attachment(filename = '', options: any) {
    if (filename) this.setType(extname(filename));
    this.setHeader('Content-Disposition', contentDisposition(filename, options));
    return this;
  }

  /**
   * attachment alias
   * @public
   * @param filename
   */
  download(data: any, filename = '', options: any) {
    return this.setData(data).attachment(filename, options);
  }

  /**
   * handle Resource data
   */
  transformData(request: any) {
    const data = this.getData();
    if (!data) return data;
    if (data instanceof Resource) {
      return data.output();
    }
    if (data instanceof View) {
      this.setType('html');
      return (new ViewFactory(data)).output(request);
    }
    return data;
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
  json(data?: any) {
    this.setType('json');
    if (data) this.setData(data);
    return this;
  }

  /**
   * set html response type
   */
  html(data?: any) {
    this.setType('html');
    if (data) this.setData(data);
    return this;
  }

  /**
   * set html response type
   */
  text(data?: any) {
    this.setType('text');
    if (data) this.setData(data);
    return this;
  }

  async commitCookies(request: any) {
    for (const _cookie of this.cookies) {
      request.cookies.set(_cookie.getName(), _cookie.getValue(), _cookie.getOptions());
    }
    if (this.app.needsSession) {
      await request.session().autoCommit();
    }
  }

  /**
   * send headers
   * @param res
   */
  sendHeaders(res: ServerResponse) {
    if (res.headersSent) return this;
    const code = this.getCode();
    const headers = this.getHeaders();
    res.writeHead(code, headers);
    return this;
  }

  /**
   * Set the returned data
   * @public
   * @param data Returned data
   */
  setData(data: any) {
    this._data = data;
    return this;
  }

  /**
   * prepare response
   * @param request 
   */
  prepare(request: Request) {
    
    const data = this.transformData(request);

    const shouldSetType = !this.getHeader('content-type');

    // if no content
    if (data === null || typeof data === 'undefined') {
      this.setCode(204);
      this.removeHeader('content-type');
      this.removeHeader('content-length');
      this.removeHeader('transfer-encoding');
      return data || '';
    }

    // string
    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      if (shouldSetType) this.setHeader('content-type', defaultContentTypes.PLAIN);
      this.setHeader('content-length', Buffer.byteLength(data.toString()));
      return data.toString();
    }
    // buffer
    if (Buffer.isBuffer(data)) {
      if (shouldSetType) this.setHeader('content-type', defaultContentTypes.OCTET);
      this.setHeader('content-length', data.length);
      return data;
    }
    // stream
    if (typeof data.pipe === 'function') {
      this.removeHeader('content-length');
      if (shouldSetType) this.setHeader('content-type', defaultContentTypes.OCTET);
      return data;
    }
    // json
    this.removeHeader('content-length');
    if (shouldSetType) this.setHeader('content-type', defaultContentTypes.JSON);

    return data;
  }


  /**
   * send data
   * @param request
   * @public
   */
  async send(request: Request) {
    const data = this.prepare(request);

    if (this.app.get('config').get('app.compress')) {
      return this.endWithCompress(request, data);
    }
    return this.end(request, data);
  }

  /**
   * end response
   * @param request 
   * @param data 
   */
  async end(request: Request, data: any) {
    const { res } = request;

    // commit cookies
    await this.commitCookies(request);
    
    // responses
    if (typeof data === 'string' || Buffer.isBuffer(data)) {
      this.sendHeaders(res);
      return res.end(data);
    }
    if (data instanceof Stream) {
      this.sendHeaders(res);
      return data.pipe(res);
    };

    // json
    const jsonData = JSON.stringify(data);
    if (!res.headersSent) {
      this.setHeader('content-length', Buffer.byteLength(jsonData));
    }
    this.sendHeaders(res);
    return res.end(jsonData);
  }

  /**
   * end with compress
   * @param request 
   */
  endWithCompress(request: Request, data: any) {

    // if compress is disable
    const encoding: string | false = request.acceptsEncodings('gzip', 'deflate', 'identity');

    if (!encoding || encoding === 'identity') return this.end(request, data);

    if (!compressible(this.getType())) return this.end(request, data);

    const threshold = this.app.get('config').get('app.threshold', 1024);

    if (threshold > this.getLength()) return this.end(request, data);

    this.setHeader('Content-Encoding', encoding);
    this.removeHeader('Content-Length');

    const stream = encodingMethods[encoding as 'gzip' | 'deflate']({});

    if (data instanceof Stream) {
      data.pipe(stream);
    } else {
      stream.end(data);
    }

    return this.end(request, stream);
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import is from 'core-util-is';
import { Response } from '../../response';
import { Component } from '../../decorators';
import { Middleware } from '../../base/middleware';
import { Request } from '../../request';
import { TNext } from '../../middleware';

const defaultOptions = {
  origin: '*',
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
};

@Component('cors')
export class CORSMiddleware extends Middleware {
  options: any;
  constructor(options: any) {
    super();
    this.options = this.parseOptions(options);
  }

  parseOptions(options: any) {
    if (is.isString(options)) {
      return {
        ...defaultOptions,
        origin: options,
      };
    } if (is.isObject(options)) {
      return {
        ...defaultOptions,
        ...options,
      };
    }
    return defaultOptions;
  }

  get origin() {
    return this.options.origin || '*';
  }

  get maxAge() {
    return this.options.maxAge || 5;
  }

  get credentials() {
    return this.options.credentials || true;
  }

  get allowMethods() {
    return this.options.allowMethods || ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'];
  }

  get allowHeaders() {
    return this.options.allowHeaders || ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'];
  }

  async resolve(request: Request, next: TNext): Promise<Response> {
    const requestOrigin = request.getHeader('Origin');
    if (!requestOrigin) return next();
    if (request.isOptions()) {
      // Preflight Request
      if (!request.getHeader('Access-Control-Request-Method')) return next();

      const response = new Response();

      response.setHeader('Access-Control-Allow-Origin', this.origin);

      if (this.credentials) {
        response.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      if (this.maxAge) {
        response.setHeader('Access-Control-Max-Age', this.maxAge);
      }

      if (this.allowMethods) {
        response.setHeader('Access-Control-Allow-Methods', this.allowMethods);
      }

      response.setHeader('Access-Control-Allow-Headers', this.allowHeaders || request.getHeader('Access-Control-Request-Headers'));
      return response.NoContent();
    }

    const response = await next();

    response.setVary('Origin');

    response.setHeader('Access-Control-Allow-Origin', this.origin);

    if (this.credentials) {
      response.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  }
}

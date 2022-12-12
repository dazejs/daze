/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Tokens from 'csrf';
import { AutoScan, Depends, Provide, Disable } from '../../decorators';
import { Request } from '../../request';
import { Response } from '../../response';
import { Router } from '../../router';
import * as symbols from '../../symbol';
import * as providers from './providers';

@Depends([
  // providers.StereotypeProvider,
  providers.DatabaseProvider,
  providers.LoggerProvider,
  providers.TemplateProvider,
  providers.HttpServerProvider
])
@AutoScan('./app')
export class AppProvider {
  @Provide('csrf')
  _csrf() {
    return new Tokens();
  }

  @Provide('router')
  _router() {
    return new Router();
  }

  @Provide(Request, false)
  @Disable
  _requestInstance(request: Request) {
    return request;
  }

  @Provide(symbols.INJECTORS.REQUEST, false)
  @Disable
  _request(request: Request) {
    return request;
  }

  @Provide(Response, false)
  @Disable
  _responseInstance() {
    return new Response();
  }

  @Provide(symbols.INJECTORS.REQ, false)
  @Disable
  _req(request: Request) {
    return request.req;
  }

  @Provide(symbols.INJECTORS.RES, false)
  @Disable
  _res(request: Request) {
    return request.res;
  }

  @Provide(symbols.INJECTORS.QUERY, false)
  @Disable
  _query(request: Request) {
    return request.getQuery();
  }

  @Provide(symbols.INJECTORS.PARAMS, false)
  @Disable
  _params(request: Request) {
    return request.getParams();
  }

  @Provide(symbols.INJECTORS.HEADERS, false)
  @Disable
  _headers(request: Request) {
    return request.getHeaders();
  }

  @Provide(symbols.INJECTORS.BODY, false)
  @Disable
  _body(request: Request) {
    return request.getBody();
  }

  @Provide(symbols.INJECTORS.COOKIE, false)
  @Disable
  _cookie(request: Request) {
    return request.cookies;
  }

  @Provide(symbols.INJECTORS.SESSION, false)
  @Disable
  _session(request: Request) {
    return request.session();
  }
}
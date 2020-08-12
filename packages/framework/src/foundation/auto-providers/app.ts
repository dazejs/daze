/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Tokens from 'csrf';
import { autoScan, depends, provide, disable } from '../../decorators';
import { Request } from '../../request';
import { Response } from '../../response';
import { Router } from '../../router';
import * as symbols from '../../symbol';
import * as providers from './providers';

@depends([
  // providers.StereotypeProvider,
  providers.DatabaseProvider,
  providers.LoggerProvider,
  providers.TemplateProvider,
  providers.HttpServerProvider
])
@autoScan('./app')
export class AppProvider {
  @provide('csrf')
  _csrf() {
    return new Tokens();
  }

  @provide('router')
  _router() {
    return new Router();
  }

  @provide(Request, false)
  @disable
  _requestInstance(request: Request) {
    return request;
  }

  @provide(symbols.INJECTORS.REQUEST, false)
  @disable
  _request(request: Request) {
    return request;
  }

  @provide(Response, false)
  @disable
  _responseInstance() {
    return new Response();
  }

  @provide(symbols.INJECTORS.REQ, false)
  @disable
  _req(request: Request) {
    return request.req;
  }

  @provide(symbols.INJECTORS.RES, false)
  @disable
  _res(request: Request) {
    return request.res;
  }

  @provide(symbols.INJECTORS.QUERY, false)
  @disable
  _query(request: Request) {
    return request.getQuery();
  }

  @provide(symbols.INJECTORS.PARAMS, false)
  @disable
  _params(request: Request) {
    return request.getParams();
  }

  @provide(symbols.INJECTORS.HEADERS, false)
  @disable
  _headers(request: Request) {
    return request.getHeaders();
  }

  @provide(symbols.INJECTORS.BODY, false)
  @disable
  _body(request: Request) {
    return request.getBody();
  }

  @provide(symbols.INJECTORS.COOKIE, false)
  @disable
  _cookie(request: Request) {
    return request.cookies;
  }

  @provide(symbols.INJECTORS.SESSION, false)
  @disable
  _session(request: Request) {
    return request.session();
  }
}
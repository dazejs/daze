/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Tokens from 'csrf';
import { autoScan, depend, provide } from '../../decorators/provider';
import { Request } from '../../request';
import { Response } from '../../response';
import { Router } from '../../router';
import * as symbols from '../../symbol';
import * as providers from './providers';

@depend([
  providers.DatabaseProvider,
  providers.MiddlewareServiceProvider,
  providers.ServiceProvider,
  providers.ResourceProvider,
  providers.ValidatorProvider,
  providers.ModelProvider,
  providers.ComponentProvider,
  providers.ControllerServiceProvider,
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

  @provide(symbols.INJECTORS.REQUEST, false)
  _request(request: Request) {
    return request;
  }

  @provide(symbols.INJECTORS.RESPONSE, false)
  _response() {
    return new Response();
  }

  @provide(symbols.INJECTORS.REQ, false)
  _req(request: Request) {
    return request.req;
  }

  @provide(symbols.INJECTORS.RES, false)
  _res(request: Request) {
    return request.res;
  }

  @provide(symbols.INJECTORS.QUERY, false)
  _query(request: Request) {
    return request.getQuery();
  }

  @provide(symbols.INJECTORS.PARAMS, false)
  _params(request: Request) {
    return request.getParams();
  }

  @provide(symbols.INJECTORS.HEADERS, false)
  _headers(request: Request) {
    return request.getHeaders();
  }

  @provide(symbols.INJECTORS.BODY, false)
  _body(request: Request) {
    return request.getBody();
  }

  @provide(symbols.INJECTORS.COOKIE, false)
  _cookie(request: Request) {
    return request.cookies;
  }

  @provide(symbols.INJECTORS.SESSION, false)
  _session(request: Request) {
    return request.session();
  }
}
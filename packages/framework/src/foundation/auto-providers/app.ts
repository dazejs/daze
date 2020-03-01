/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Tokens from 'csrf';
import { Provider } from '../../base/provider';
import { ComponentProvider } from '../../component/component-provider';
import { ControllerServiceProvider } from '../../controller/controller-service-provider';
import { DatabaseProvider } from '../../database/database-provider';
import { depend, provide } from '../../decorators/provider';
import { LoggerProvider } from '../../logger/logger-provider';
import { MiddlewareServiceProvider } from '../../middleware/middleware-service-provider';
import { ModelProvider } from '../../model/model-provider';
import type { Request } from '../../request';
import { ResourceProvider } from '../../resource/resource-provider';
import { Response } from '../../response';
import { Router } from '../../router';
import { ServiceProvider } from '../../service/service-provider';
import * as symbols from '../../symbol';
import { TemplateProvider } from '../../template/template-provider';
import { ValidatorProvider } from '../../validate/validator-provider';

@depend([
  DatabaseProvider,
  MiddlewareServiceProvider,
  ServiceProvider,
  ResourceProvider,
  ValidatorProvider,
  ModelProvider,
  ComponentProvider,
  ControllerServiceProvider,
  LoggerProvider,
  TemplateProvider
])
export class AppProvider extends Provider {
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
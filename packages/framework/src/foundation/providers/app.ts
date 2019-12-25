/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Tokens from 'csrf';

import * as symbols from '../../symbol';
import { Application } from '../application';

// FIXME 不单单是这个文件，而是所有provider。建议加一个Provider基类作为类型，不然很多涉及到provider基类的地方无法做类型标记(譬如Application)

export class AppProvider {
  /**
   * application
   */
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  register() {
    this.app.singleton('csrf', Tokens);

    this.registerInjectors();
  }

  registerInjectors() {
    // for @HttpRequest
    this.app.multiton(
      symbols.INJECTORS.REQUEST,
      (request: any) => request,
      true,
    );

    // for @HttpResponse
    this.app.multiton(
      symbols.INJECTORS.RESPONSE,
      (request: any) => request.response,
      true,
    );

    // for @Req
    this.app.multiton(
      symbols.INJECTORS.REQ,
      (request: any) => request.req,
      true,
    );

    // for @Res
    this.app.multiton(
      symbols.INJECTORS.RES,
      (request: any) => request.res,
      true,
    );

    // for @HttpQuery
    this.app.multiton(symbols.INJECTORS.QUERY, 
      (request: any) => request.query, 
      true)
    ;

    // for @HttpParams
    this.app.multiton(
      symbols.INJECTORS.PARAMS,
      (request: any) => request.getParams(),
      true,
    );

    // for @HttpHeaders
    this.app.multiton(
      symbols.INJECTORS.HEADERS,
      (request: any) => request.headers,
      true,
    );

    // for @HttpBody
    this.app.multiton(
      symbols.INJECTORS.BODY,
      (request: any) => request.body,
      true,
    );

    // for @CookieValue
    this.app.multiton(
      symbols.INJECTORS.COOKIE,
      (request: any) => request.cookies,
      true,
    );

    // for @SessionValue
    this.app.multiton(
      symbols.INJECTORS.SESSION,
      (request: any) => request.session(),
      true,
    );

    // this.app.multiton(symbols.INJECTORS.SERVICE, (key: string) => this.app.get(`service.${key}`), true);
    // this.app.multiton(symbols.INJECTORS.VALIDATOR, (key: string) => this.app.get(`validator.${key}`), true);
    // this.app.multiton(symbols.INJECTORS.COMPONENT, (key: string) => this.app.get(`component.${key}`), true);
    // this.app.multiton(symbols.INJECTORS.RESOURCE, (key: string) => this.app.get(`resource.${key}`), true);
    // this.app.multiton(symbols.INJECTORS.MODEL, (key: string) => this.app.get(`model.${key}`), true);
  }
}

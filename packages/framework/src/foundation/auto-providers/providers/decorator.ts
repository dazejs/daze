/**
 * Copyright (c) 2020 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider as BaseProvider } from '../../../base/provider';
import { provide } from '../../../decorators/provider';
import { Request } from '../../../request';
import { Response } from '../../../response';
import * as symbols from '../../../symbol';


export class DecoratorProvider extends BaseProvider {
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
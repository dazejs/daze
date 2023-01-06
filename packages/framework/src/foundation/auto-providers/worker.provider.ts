// import Tokens from 'csrf';
import Tokens from 'csrf';
import { Depends, Provide, Disable, Provider } from '../../decorators';
import { Request } from '../../http/request';
// import { Response } from '../../http/response';
import * as symbols from '../../symbol';
import { request } from '../../helpers';
import * as providers from './depends';
import { AsyncLocalStorage } from 'async_hooks';

@Depends([
  providers.TemplateEngineProvider,
  providers.AppServerProvider,
])
@Provider()
export class WorkerProvider {
  @Provide(symbols.ASYNC_LOCAL_STORAGE)
  @Disable
  asyncLocalStorage() {
    return new AsyncLocalStorage();
  }

  @Provide('csrf')
  _csrf() {
    return new Tokens();
  }

  @Provide(Request, false)
  @Disable
  _requestInstance() {
    return request();
  }

  @Provide(symbols.INJECTORS.QUERY, false)
  @Disable
  _query() {
    return request().query;
  }

  @Provide(symbols.INJECTORS.BODY, false)
  @Disable
  _body() {
    return request().body;
  }
}
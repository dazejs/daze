/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as http from 'http';

import { Container } from '../../container';
import { ErrorHandler } from '../../errors/handle';
import { HttpError } from '../../errors/http-error';
import { Request } from '../../request';
import { Response } from '../../response';
import { ResponseManager } from '../../response/manager';
import { Application } from '../application';

export class HttpServer {
  app: Application = Container.get('app');

  listen(port: number) {
    const routeHandler = this.app.get('router').resolve();
    const middleware = this.app.get('middleware');
    const server = http.createServer(async (req, res) => {
      const request = new Request(req, res);
      await request.initialize();
      return middleware
        .handle(request, routeHandler)
        .then(
          this.getHttpErrorHandler()
        )
        .then(
          this.getResponseOuputHandler(request)
        )
        .catch(
          this.getErrorHandler(request)
        );
    });
    return server.listen(port);
  }

  getResponseOuputHandler(request: Request) {
    return (response: Response) => {
      return new ResponseManager(response).output(request);
    };
  }

  getErrorHandler(request: Request) {
    return (error: Error) => {
      this.app.emit('error', error);
      const err = new ErrorHandler(request, error);
      return new ResponseManager(err.render()).output(request);
    };
  }

  getHttpErrorHandler() {
    return (response: Response) => {
      const code = response.getCode();
      const data = response.getData();
      const headers = response.getHeaders();
      if (code >= 400) {
        throw new HttpError(code, data, headers);
      }
      return response;
    };
  }
}

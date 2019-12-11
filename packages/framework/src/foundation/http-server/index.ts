/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as http from 'http';

import { Container } from '../../container';
// import { ErrorHandler } from '../../errors/handle';
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
        .then((response: Response) => {
          const code = response.getCode();
          const data = response.getData();
          const headers = response.getHeaders();
          if (code >= 400) {
            throw new HttpError(code, data, headers);
          }
          return response;
        })
        .then((response: Response) => {
          return new ResponseManager(response).output(request);
        })
        .catch((error: Error) => {
          this.app.emit('error', error, request);
        });
    });
    return server.listen(port);
  }
}

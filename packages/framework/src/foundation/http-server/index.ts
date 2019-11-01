/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


import http from 'http';
import { Container } from '../../container';
import { Request} from '../../request';
import { Response} from '../../response';
import { ErrorHandler} from '../../errors/handle';
import { ResponseManager} from '../../response/manager';
import { Application } from '../application';
import { HttpError } from '../../errors/http-error';


export class HttpServer {
  app: Application = Container.get('app');;

  listen(port: number) {
    const routerHandler = this.app.get('router').resolve();
    const middleware = this.app.get('middleware');
    const server = http.createServer(async (req, res) => {
      const request = new Request(req, res);
      await request.initialize();
      return middleware
        .handle(request, routerHandler)
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
          this.app.emit('error', error);
          const err = new ErrorHandler(request, error);
          return new ResponseManager(err.render()).output(request);
        });
    });
    return server.listen(port);
  }
}

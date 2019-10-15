/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


import http from 'http'
import { Container } from '../../container'
import { Request} from '../../request'
import { ErrorHandler} from '../../errors/handle'
import { ResponseManager} from '../../response/manager'
import { Application } from '../application'


export class httpServer {
  app: Application = Container.get('app');;

  listen(port: number) {
    const routerHandler = this.app.get('router').resolve();
    const middleware = this.app.get('middleware')
    const server = http.createServer(async (req, res) => {
      const request = new Request(req, res);
      await request.initialize();
      return middleware
        .handle(request, routerHandler)
        .then((response: any) => {
          return new ResponseManager(response).output(request);
        })
        .catch((error: any) => {
          this.app.emit('error', error);
          const err = new ErrorHandler(request, error);
          return new ResponseManager(err.render()).output(request);
        });
    });
    return server.listen(port);
  }
}

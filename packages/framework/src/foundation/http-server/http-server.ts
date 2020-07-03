/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as http from 'http';
import * as https from 'https';
import { Container } from '../../container';
import { ErrorCollection, ErrorHandler } from '../../errors/handle';
import { HttpError } from '../../errors/http-error';
import { Request } from '../../request';
import { Response } from '../../response';
import { ResponseManager } from '../../response/manager';
import { Application } from '../application';

export class HttpServer {
  /**
   * Application instance
   */
  app: Application = Container.get('app');

  /**
   * http server instance
   */
  server: http.Server | https.Server;

  /**
   * return server instance
   */
  getServer() {
    return this.server;
  }

  /**
   * create http Server
   */
  createServer() {
    const routeHandler = this.app.get('router').resolve();
    const middleware = this.app.get('middleware');


    const callback: http.RequestListener = async (req, res) => {
      const request = new Request(req, res);
      await request.initialize();
      return middleware
        .handle(request, routeHandler)
        .then((response: Response) => {
          const code = response.getCode();
          const data = response.getData();
          const headers = response.getHeaders();
          if (code >= 400 && !response.isForce()) {
            throw new HttpError(code, data, headers);
          }
          return response;
        })
        .then((response: Response) => {
          return new ResponseManager(response).output(request);
        })
        .catch((err: ErrorCollection) => {
          const handler = new ErrorHandler(err, request);
          handler.report();
          // error 对象上存在 report 函数则执行
          if (err.report && typeof err.report === 'function') err.report();
          if (err.render && typeof err.render === 'function') {
            return new ResponseManager(err.render(this.app)).output(request);
          } else {
            const handler = new ErrorHandler(err, request);
            return new ResponseManager(handler.render()).output(request);
          }
        });
    }

    if (this.app.isHttps) {
      this.server = https.createServer(this.app.httpsOptions as any, callback);
    } else {
      this.server = http.createServer(callback);
    }
    
    return this.server;
  }

  /**
   * listen
   * @param port 
   * @param hostname 
   * @param backlog 
   * @param listeningListener 
   */
  listen(
    port?: number | undefined,
    hostname?: string | undefined,
    backlog?: number | undefined,
    listeningListener?: () => void
  ): http.Server {
    return this.server.listen(port, hostname, backlog, listeningListener);
  }
}

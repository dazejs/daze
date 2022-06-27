/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as http from 'http';
import * as https from 'https';
import { Container } from '../../container';
import { ErrorHandler } from '../../errors/handle';
import { HttpError } from '../../errors/http-error';
import { Request } from '../request';
import { Response } from '../response';
import { MiddlewareService } from '../middleware';
import { ResponseManager } from '../response/manager';
import { Application } from '../../foundation/application';
import debuger from 'debug';

const debug = debuger('@daze/framework:server');
 
export class AppServer {
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
    const router = this.app.get('router');
    const middleware = this.app.get<MiddlewareService>(MiddlewareService);
 
    const callback: http.RequestListener = async (req, res) => {
      debug('接收请求');
      const request = new Request(req, res);
      const matchedRoute = router.match(request.method, request.path);
      await request.initialize(matchedRoute);
      debug('已初始化 Request 对象');

      try {
        const resolver =  router.createResolver(matchedRoute);
        const response: Response = await middleware.handle(request, resolver);
        const code = response.getCode();
        const data = response.getData();
        const headers = response.getHeaders();
        if (code >= 400 && !response.isForce()) {
          throw new HttpError(code, data, headers);
        }
        await this.end(response, request);
      } catch (err: any) {
        const handler = new ErrorHandler(err, request);
        handler.report();
        // error 对象上存在 report 函数则执行
        if (err.report && typeof err.report === 'function') err.report();
        if (err.render && typeof err.render === 'function') {
          await this.end(err.render(this.app), request);
        } else {
          const handler = new ErrorHandler(err, request);
          await this.end(handler.render(), request);
        }
      }
    };
    if (this.app.isHttps) {
      this.server = https.createServer(this.app.httpsOptions as any, callback);
    } else {
      this.server = http.createServer(callback);
    }
    this.server.on('clientError', (_, socket) => {
      if (!socket.writable) {
        return;
      }
      return socket.end('400 Bad Request\r\n\r\n');
    });
    return this.server;
  }

  async end(data: any, request: any) {
    try {
      await new ResponseManager(data).output(request);
    } catch (err) {
      this.app.emit('error', err);
    }
  }
 
  listen(...args: any[]): http.Server {
    return this.server.listen(...args);
  }
}
 
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
import { ResponseManager } from '../response/manager';
import { Application } from '../../foundation/application';
import Debug from 'debug';
import { MiddlewareService } from '../middleware';
import { ASYNC_LOCAL_STORAGE } from '../../symbol';
import { app } from '../../helpers';
import { AsyncLocalStorage } from 'async_hooks';
import { Router } from '../router';

const debug = Debug('@dazejs/framework:server');

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
    const middleware = this.app.get<MiddlewareService>(MiddlewareService);
    const callback: http.RequestListener = async (req, res) => {
      debug('接收请求');
      const router = this.app.get<Router>('router');
      const request = new Request(req, res);
      const matchedRoute = router.match(request);
      // 初始化 Request 对象
      await request.initialize(matchedRoute);
      debug('已初始化 Request 对象');

      const conextStore = new Map();

      app().get<AsyncLocalStorage<Map<string, any>>>(ASYNC_LOCAL_STORAGE).run(conextStore, async () => {
        conextStore.set('request', request);
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
            return new ResponseManager(err.render(this.app)).output(request);
          } else {
            const handler = new ErrorHandler(err, request);
            return new ResponseManager(handler.render()).output(request);
          }
        }
      });
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

  /**
     * listen
     */
  listen(...args: any[]): http.Server {
    return this.server.listen(...args);
  }
}

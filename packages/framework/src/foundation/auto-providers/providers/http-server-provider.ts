/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { provide } from '../../../decorators/provider';
import { HttpServer } from '../../http-server/http-server';
import { inject } from '../../../decorators/inject';
import { Application } from '../../application';

export class HttpServerProvider {

  @inject() app: Application;


  @provide('httpServer')
  httpServer() {
    return new HttpServer();
  }

  launch() {
    this.app.get<HttpServer>('httpServer').createServer();
  }
}
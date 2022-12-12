/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { BaseProvider } from '../../base/provider';
import { Provide } from '../../decorators';
import { HttpServer } from './http-server';

export class HttpServerProvider extends BaseProvider {
  @Provide('httpServer')
  httpServer() {
    return new HttpServer();
  }

  launch() {
    this.app.get<HttpServer>('httpServer').createServer();
  }
}
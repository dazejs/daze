/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { HttpServer } from '../../http-server/http-server';
import { provide, provider } from '../../../decorators';
// import { Application } from '../../application';
import { BaseProvider } from '../../../base';

@provider()
export class HttpServerProvider extends BaseProvider {

  // @inject() app: Application;


  @provide('httpServer')
  httpServer() {
    return new HttpServer();
  }

  launch() {
    this.app.get<HttpServer>('httpServer').createServer();
  }
}
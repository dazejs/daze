/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { HttpServer } from '../http-server';
import { Provider as BaseProvider } from '../../base/provider';
import { provide } from '../../decorators/provider';


export class HttpServerProvider extends BaseProvider {
  @provide('httpServer')
  httpServer() {
    return new HttpServer();
  }
}
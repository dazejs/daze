/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { httpServer } from '../http-server'


export class HttpServerProvider {
  app: any;
  /**
   * create Logger Provider
   * @param app Application
   */
  constructor(app: any) {
    /**
     * @var app Application
     */
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind Logger in container
    this.app.singleton('httpServer', httpServer);
  }
}

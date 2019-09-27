/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Middleware } from '../../middleware'

export class MiddlewareProvider {
  app: any;
  /**
   * create Middleware Provider
   * @param app Application
   */
  constructor(app: any) {
    /**
     * @var {Object} app Application
     */
    this.app = app;
  }

  register() {
    this.app.singleton('middleware', Middleware);
  }
}

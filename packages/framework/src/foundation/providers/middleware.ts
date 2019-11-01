/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Middleware } from '../../middleware';
import { Application } from '../application';

export class MiddlewareProvider {
  app: Application;
  /**
   * create Middleware Provider
   * @param app Application
   */
  constructor(app: Application) {
    /**
     * @var app Application
     */
    this.app = app;
  }

  register() {
    this.app.singleton('middleware', Middleware);
  }
}

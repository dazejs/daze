/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Router } from '../../router';
import { Application } from '../application';

export class RouterProvider {
  app: Application;
  /**
   * create Router Provider
   * @param app Application
   */
  constructor(app: Application) {
    /**
     * @var app Application
     */
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind config in container
    this.app.singleton('router', Router);
  }
}

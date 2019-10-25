/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Application } from '../application'
// import { Database } from '../../database'

export class DatabaseProvider {
  /**
   * @var app Application
   */
  app: Application;

  /**
   * create Cookie Provider
   * @param app Application
   */
  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind cookie in container
    // this.app.singleton('db', Database);
  }
}

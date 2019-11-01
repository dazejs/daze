/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Logger } from '../../logger';
import { Application } from '../application';

export class LoggerProvider {
  app: Application;
  /**
   * create Logger Provider
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
    // bind Logger in container
    this.app.singleton('logger', Logger);
  }
}

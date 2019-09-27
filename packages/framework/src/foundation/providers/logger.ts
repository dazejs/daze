/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Logger } from '../../logger'

export class LoggerProvider {
  app: any;
  /**
   * create Logger Provider
   * @param app Application
   */
  constructor(app: any) {
    /**
    * @var {Object} app Application
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

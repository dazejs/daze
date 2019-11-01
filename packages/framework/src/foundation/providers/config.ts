/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Config } from '../../config';
import { Application } from '../application';

export class ConfigProvider {
  app: Application;
  /**
   * create Config Provider
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
    this.app.singleton('config', Config);
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Config } from '../../config'

export class ConfigProvider {
  app: any;
  /**
   * create Config Provider
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
    // bind config in container
    this.app.singleton('config', Config);
  }
}

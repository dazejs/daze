/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Cookie } from '../../cookie'

export class CookieProvider {
  /**
   * @var app Application
   */
  app: any;

  /**
   * create Cookie Provider
   * @param app Application
   */
  constructor(app: any) {
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind cookie in container
    this.app.singleton('cookie', Cookie);
  }
}

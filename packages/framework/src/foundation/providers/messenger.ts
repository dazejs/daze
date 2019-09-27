/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messenger } from '../../cluster/messenger'

export class MessengerProvider {
  app: any;
  /**
   * create Messenger Provider
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
    // bind Messenger in container
    this.app.singleton('messenger', Messenger);
  }
}

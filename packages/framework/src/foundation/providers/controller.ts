/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Controller } from '../../controller'

export class ControllerProvider {
  app: any;
  /**
   * create Controller Provider
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
    // bind controller in container
    this.app.singleton('controller', Controller);
  }
}

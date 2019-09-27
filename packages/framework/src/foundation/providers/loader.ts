/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Loader } from '../../loader'

export class LoaderProvider {
  app: any;
  constructor(app: any) {
    this.app = app;
  }

  register() {
    this.app.singleton('loader', Loader);
  }

  async launch() {
    await this.app.get('loader').resolve();
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Database } from '../../database';
import { Provider as BaseProvider } from '../../base/provider';


export class DatabaseProvider extends BaseProvider {
  /**
   * Provider register Hook
   */
  register() {
    // bind cookie in container
    this.app.singleton('db', Database);
  }
}

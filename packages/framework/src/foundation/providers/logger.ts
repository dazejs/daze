/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Logger } from '../../logger';
import { Provider as BaseProvider } from '../../base/provider';

export class LoggerProvider extends BaseProvider {
  /**
   * Provider register Hook
   */
  register() {
    // bind Logger in container
    this.app.singleton('logger', Logger);
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Messenger } from '../../cluster/messenger';
import { Provider as BaseProvider } from '../../base/provider';


export class MessengerProvider extends BaseProvider {
  /**
   * Provider register Hook
   */
  register() {
    // bind Messenger in container
    this.app.singleton('messenger', Messenger);
  }
}

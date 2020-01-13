/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ControllerManager } from '../../controller/manager';
import { Provider as BaseProvider } from '../../base/provider';

export class ControllerProvider extends BaseProvider {

  /**
   * Provider register Hook
   */
  register() {
    // bind controller in container
    this.app.singleton('controller-manager', ControllerManager);
  }
}

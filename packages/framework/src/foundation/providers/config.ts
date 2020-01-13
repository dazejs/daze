/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Config } from '../../config';
import { Provider as BaseProvider } from '../../base/provider';


export class ConfigProvider extends BaseProvider {
  /**
   * Provider register Hook
   */
  register() {
    // bind config in container
    this.app.singleton('config', Config);
  }
}

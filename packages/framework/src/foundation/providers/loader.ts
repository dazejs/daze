/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Loader } from '../../loader';
import { Provider as BaseProvider } from '../../base/provider';

export class LoaderProvider extends BaseProvider {
 
  register() {
    this.app.singleton('loader', Loader);
  }

  async launch() {
    await this.app.get<Loader>('loader').autoScanApp();
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider as BaseProvider } from '../../base/provider';
import { Config } from '../../config';
import { provide } from '../../decorators/provider';
import { Loader } from '../../loader';
import { Application } from '../application';
import { Messenger } from '../../cluster/messenger';

export class CommonProvider extends BaseProvider {

  @provide('config')
  _config() {
    return new Config();
  }

  @provide('loader')
  _loader(app: Application) {
    return new Loader(app);
  }

  @provide('messenger')
  _mssenger() {
    return new Messenger();
  }

  async launch() {
    await this.app.get<Loader>('loader').autoScanApp();
  }
}

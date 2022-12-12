/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as providers from './providers';
import { Provide, Depends } from '../../decorators';
// import { Application } from '../application';
import { MessengerService } from '../../messenger';
import { BaseProvider } from '../../base/provider';

@Depends([
  providers.ConfigProvider,
  providers.LoaderProvider,
  providers.StereotypeProvider,
])
export class CommonProvider extends BaseProvider {

  @Provide('messenger')
  _mssenger() {
    return new MessengerService();
  }
}

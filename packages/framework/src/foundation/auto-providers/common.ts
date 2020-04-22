/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as providers from './providers';
import { provide, depend } from '../../decorators/provider';
// import { Application } from '../application';
import { MessengerService } from '../../messenger';
import { BaseProvider } from '../../base/provider';

@depend([
  providers.ConfigProvider,
  providers.LoaderProvider
])
export class CommonProvider extends BaseProvider {

  @provide('messenger')
  _mssenger() {
    return new MessengerService();
  }
}

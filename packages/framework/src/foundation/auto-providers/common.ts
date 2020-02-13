/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider as BaseProvider } from '../../base/provider';
import { ConfigProvider } from '../../config';
import { provide, depend } from '../../decorators/provider';
import { LoaderProvider } from '../../loader';
// import { Application } from '../application';
import { Messenger } from '../../messenger';

@depend([
  ConfigProvider,
  LoaderProvider
])
export class CommonProvider extends BaseProvider {

  @provide('messenger')
  _mssenger() {
    return new Messenger();
  }
}

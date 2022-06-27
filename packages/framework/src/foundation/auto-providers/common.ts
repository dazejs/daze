/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as providers from './depends';
import { depends, appendAgent, appendMaster, provide } from '../../decorators';
import { Application } from '../application';
import { BaseProvider } from '../../base/provider';
import { Loader } from '../../loader';
import path from 'path';
import Tokens from 'csrf';

@depends([
  providers.RouterProvider,
  providers.StereotypeProvider,
  providers.MessengerProvider,
  providers.LoggerProvider,
  providers.DatabaseProvider,
  providers.MailerProvider,
  providers.RedisProvider,
  providers.CacheProvider,
])
@appendAgent()
@appendMaster()
export class CommonProvider extends BaseProvider {
  @provide('csrf')
  _csrf() {
    return new Tokens();
  }


  async register(app: Application) {
    const loader = app.get<Loader>('loader');
    await loader.scan(
      path.resolve(__dirname, '../buildin-app')
    );
    await loader.autoScanApp();
  }
}

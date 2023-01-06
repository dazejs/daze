/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import path from 'path';
import { Depends, Provider } from '../../decorators';
import { app } from '../../helpers';
import { Loader } from '../../loader';
import * as providers from './depends';

@Depends([
  providers.RouterProvider,
  providers.StereotypeProvider,
  providers.MessengerProvider,
  providers.LoggerProvider,
  providers.DatabaseProvider,
  providers.RedisProvider,
  providers.ProxyProvider,
  providers.CacheProvider,
  providers.MailerProvider,
  providers.ScheduleProvider,
])
@Provider()
export class CommonProvider {
  async register() {
    const loader = app().get<Loader>('loader');
    await loader.scan(
      path.resolve(__dirname, '../buildin-app')
    );
    await loader.autoScanApp();
  }
}

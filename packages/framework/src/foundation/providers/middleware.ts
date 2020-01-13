/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Middleware } from '../../middleware';
import { Provider as BaseProvider } from '../../base/provider';

export class MiddlewareProvider extends BaseProvider {

  register() {
    this.app.singleton('middleware', Middleware);
  }
}

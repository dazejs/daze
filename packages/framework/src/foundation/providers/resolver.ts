/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Loader } from '../../loader';
import { Resolver } from '../../resolver';
import { Provider as BaseProvider } from '../../base/provider';

export class ResolverProvider extends BaseProvider {
  /**
   * Provider register Hook
   */
  register() {
    this.app.singleton('resolver', Resolver);
  }

  launch() {
    const loader = this.app.get<Loader>('loader');
    this.app.get<Resolver>('resolver', [loader]).resolveAllModules();
  }
}

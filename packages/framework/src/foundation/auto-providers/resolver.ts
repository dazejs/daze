/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider as BaseProvider } from '../../base/provider';
import { provide } from '../../decorators/provider';
import { inject } from '../../decorators/inject';
import { Loader } from '../../loader';
import { Resolver } from '../../resolver';
import { Application } from '../application';


export class ResolverProvider extends BaseProvider {

  @inject('loader') loader: Loader;

  @provide('resolver')
  _resolver(app: Application) {
    return new Resolver(this.loader, app);
  }

  launch() {
    this.app.get<Resolver>('resolver').resolveAllModules();
  }
}
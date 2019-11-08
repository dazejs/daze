/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Loader } from '../../loader';
import { Resolver } from '../../resolver';
import { Application } from '../application';

export class ResolverProvider {
  app: Application;
  /**
   * create Controller Provider
   * @param app Application
   */
  constructor(app: Application) {
    /**
     * @var app Application
     */
    this.app = app;
  }

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

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider } from '../base';
import { inject } from '../decorators/inject';
import { provide } from '../decorators/provider';
import type { Application } from '../foundation/application';
import type { Loader } from '../loader';
import { ControllerService } from './controller-service';

export class ControllerServiceProvider extends Provider {
  /**
   * inject loader
   */
  @inject('loader') loader: Loader;

  /**
   * auto provide ControllerService
   * @param app 
   */
  @provide('daze-controller-service')
  _controllerService(app: Application) {
    return new ControllerService(app);
  }

  /**
   * resolve controllers when app started
   */
  launch() {
    const controllers = this.loader.getComponentsByType('controller') || [];
    for (const Controller of controllers) {
      this.app.multiton(Controller, Controller);
      this.app.get<ControllerService>('daze-controller-service').register(Controller);
    }
  }
}

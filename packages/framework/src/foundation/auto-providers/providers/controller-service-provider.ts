/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { inject, provide } from '../../../decorators';
import { ControllerService } from '../../../controller/controller-service';
import { Application } from '../../application';
import { Loader } from '../../../loader';

export class ControllerServiceProvider {

  @inject() app: Application;
  /**
   * inject loader
   */
  @inject() loader: Loader;

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

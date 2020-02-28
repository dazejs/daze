/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider } from '../base';
import { Application } from '../foundation/application';
import { provide } from '../decorators/provider';
import { ControllerService } from './controller-service';


export class ControllerServiceProvider extends Provider {
  @provide(ControllerService)
  _controllerService(app: Application) {
    return new ControllerService(app);
  }
}

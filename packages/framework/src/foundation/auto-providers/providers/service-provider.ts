import { inject } from '../../../decorators';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';
import { Str } from '../../../utils';

export class ServiceProvider {
  @inject() app: Application;
  @inject() loader: Loader;

  launch() {
    const services = this.loader.getComponentsByType('service') || [];
    for (const Service of services) {
      const name = Reflect.getMetadata('name', Service) ?? Str.decapitalize(Service?.name);
      this.app.multiton(Service, Service);
      if (name) {
        this.app.multiton(name, (...args: any[]) => {
          return this.app.get(Service, args);
        }, true);
      }
    }
  }
}
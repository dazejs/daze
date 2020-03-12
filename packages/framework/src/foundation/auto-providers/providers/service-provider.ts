import { inject } from '../../../decorators/inject';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';

export class ServiceProvider {
  @inject() app: Application;
  @inject() loader: Loader;

  launch() {
    const services = this.loader.getComponentsByType('service') || [];
    for (const Service of services) {
      const name = Reflect.getMetadata('name', Service);
      this.app.multiton(Service, Service);
      if (name) {
        this.app.multiton(`service.${name}`, (...args: any[]) => {
          return this.app.get(Service, args);
        }, true);
      }
    }
  }
}
import { Provider } from '../base/provider';
import type { Loader } from '../loader';
import { inject } from '../decorators/inject';

export class ServiceProvider extends Provider {
  @inject('loader') loader: Loader;

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
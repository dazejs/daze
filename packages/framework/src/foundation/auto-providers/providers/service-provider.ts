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
      const injectionName: string | undefined = Reflect.getMetadata('name', Service) ?? Str.decapitalize(Service?.name);
      this.app.multiton(Service, Service);
      if (injectionName && !injectionName.startsWith('default')) {
        if (this.app.has(injectionName)) throw new Error(`specified service name ${injectionName} conflicts with existing!`);
        this.app.multiton(injectionName, (...args: any[]) => {
          return this.app.get(Service, args);
        }, true);
      }
    }
  }
}
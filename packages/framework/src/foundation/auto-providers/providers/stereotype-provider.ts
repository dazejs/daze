
import { inject } from '@src/decorators';
import { Loader } from '@src/loader';
import { Str } from '@src/utils/str';
import { BaseProvider } from '@src/base';
import { ProviderInterface } from '@src/interfaces';

export class StereotypeProvider extends BaseProvider implements ProviderInterface {
  @inject() loader: Loader;

  launch() {
    const components = this.loader.getComponentsByType('component') || [];
    const middlewares = this.loader.getComponentsByType('middleware') || [];
    const services = this.loader.getComponentsByType('service') || [];
    const validators = this.loader.getComponentsByType('validator') || [];
    const resources = this.loader.getComponentsByType('resource') || [];
    const entities = this.loader.getComponentsByType('entity') || [];
    const controllers = this.loader.getComponentsByType('controller') || [];
    for (const component of components) {
      this.bindStereotype(component);
    }
    for (const middleware of middlewares) {
      this.bindStereotype(middleware);
    }
    for (const service of services) {
      this.bindStereotype(service);
    }
    for (const validator of validators) {
      this.bindStereotype(validator);
    }
    for (const resource of resources) {
      this.bindStereotype(resource);
    }
    for (const entity of entities) {
      this.bindStereotype(entity);
    }
    for (const controller of controllers) {
      this.bindStereotype(controller);
    }
  }

  bindStereotype(Concrete: any, isShare = true) {
    const injectionName: string | undefined = Reflect.getMetadata('name', Concrete) ?? Str.decapitalize(Concrete?.name);
    const type: string | undefined = Reflect.getMetadata('type', Concrete);
    this.app.bind(Concrete, Concrete, isShare);
    if (injectionName && !injectionName.startsWith('default')) {
      if (this.app.has(injectionName)) throw new Error(`specified ${type} name ${injectionName} conflicts with existing!`);
      this.app.bind(injectionName, (...args: any[]) => {
        return this.app.get(Concrete, args);
      }, isShare, true);
    }
  }
}
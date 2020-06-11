import { BaseProvider } from '../../../base';
import { inject, provide } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Loader } from '../../../loader';
import { Str } from '../../../utils/str';
import { ControllerService } from '../../../controller/controller-service';
import { Application } from '../../../foundation/application';
import { MiddlewareService } from '../../../middleware/middleware-service';

export class StereotypeProvider extends BaseProvider implements ProviderInterface {
  @inject() loader: Loader;

  @provide(ControllerService)
  _controllerService(app: Application) {
    return new ControllerService(app);
  }

  /**
   * auto provide MiddlewareService
   * @param app 
   */
  @provide(MiddlewareService)
  _middleware(app: Application) {
    return new MiddlewareService(app);
  }

  /**
   * provide MiddlewareService alias
   * @param app 
   */
  @provide('middleware')
  _middlewareAlias(app: Application) {
    return app.get(MiddlewareService);
  }

  launch() {
    this.loadControllers();
    this.loadComponents();
    this.loadServices();
    this.loadResources();
    this.loadMiddlewares();
    this.loadEntities();
    this.loadValidators();
  }

  private loadControllers() {
    const controllers = this.loader.getComponentsByType('controller') || [];
    for (const controller of controllers) {
      this.bindStereotype(controller, false);
      this.app.get<ControllerService>(ControllerService).register(controller);
    }
  }

  private loadComponents() {
    const components = this.loader.getComponentsByType('component') || [];
    for (const component of components) {
      this.bindStereotype(component, false);
    }
  }

  private loadMiddlewares() {
    const middlewares = this.loader.getComponentsByType('middleware') || [];
    for (const middleware of middlewares) {
      this.bindStereotype(middleware, true);
    }
  }

  private loadServices() {
    const services = this.loader.getComponentsByType('service') || [];
    for (const service of services) {
      this.bindStereotype(service, false);
    }
  } 

  private loadValidators() {
    const validators = this.loader.getComponentsByType('validator') || [];
    for (const validator of validators) {
      this.bindStereotype(validator, false);
    }
  }

  private loadResources() {
    const resources = this.loader.getComponentsByType('resource') || [];
    for (const resource of resources) {
      this.bindStereotype(resource, false);
    }
  }

  private loadEntities() {
    const entities = this.loader.getComponentsByType('entity') || [];
    for (const entity of entities) {
      this.bindStereotype(entity, false);
    }
  }

  private bindStereotype(Concrete: any, isShare = true) {
    // bind
    this.app.bind(Concrete, Concrete, isShare);
    const injectionName: string | undefined = Reflect.getMetadata('name', Concrete) ?? Str.decapitalize(Concrete?.name);
    if (injectionName && !injectionName.startsWith('default')) {
      if (this.app.has(injectionName)) {
        const type: string | undefined = Reflect.getMetadata('type', Concrete);
        throw new Error(`specified ${type} name ${injectionName} conflicts with existing!`);
      };
      this.app.bind(injectionName, (...args: any[]) => {
        return this.app.get(Concrete, args);
      }, isShare, true);
    }
  }
}
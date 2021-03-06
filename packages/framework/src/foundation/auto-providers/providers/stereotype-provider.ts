import { BaseProvider } from '../../../base';
import { provide } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Loader } from '../../../loader';
// import { Str } from '../../../utils/str';
import { ControllerService } from '../../../controller/controller-service';
import { Application } from '../../application';
import { MiddlewareService } from '../../../middleware/middleware-service';
import * as symbols from '../../../symbol';
import { Job } from '../../../job';

export class StereotypeProvider extends BaseProvider implements ProviderInterface {
  // @inject() loader: Loader;

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

  @provide(Job)
  _database(app: Application) {
    return new Job(app);
  }

  @provide('job')
  _databaseAlias(app: Application) {
    return app.get(Job);
  }

  launch() {
    this.loadResources();
    this.loadComponents();
    this.loadServices();
    this.loadEntities();
    this.loadValidators();
    this.loadMiddlewares();
    this.loadControllers();
    this.loadJobs();
  }

  private loadJobs() {
    const components = this.app.get<Loader>('loader').getComponentsByType('job') || [];
    for (const component of components) {
      this.bindStereotype(component, false);
    }
  }

  private loadControllers() {
    const controllers = this.app.get<Loader>('loader').getComponentsByType('controller') || [];
    for (const controller of controllers) {
      this.bindStereotype(controller, false);
      this.app.get<ControllerService>(ControllerService).register(controller);
    }
  }

  private loadComponents() {
    const components = this.app.get<Loader>('loader').getComponentsByType('component') || [];
    for (const component of components) {
      this.bindStereotype(component, false);
    }
  }

  private loadMiddlewares() {
    const middlewares: Function[] = this.app.get<Loader>('loader').getComponentsByType('middleware') || [];
    for (const middleware of middlewares) {
      Reflect.defineMetadata(symbols.DISABLE_INJECT, true, middleware, 'resolve');
      this.bindStereotype(middleware, true);
    }
  }

  private loadServices() {
    const services = this.app.get<Loader>('loader').getComponentsByType('service') || [];
    for (const service of services) {
      this.bindStereotype(service, false);
    }
  } 

  private loadValidators() {
    const validators = this.app.get<Loader>('loader').getComponentsByType('validator') || [];
    for (const validator of validators) {
      this.bindStereotype(validator, false);
    }
  }

  private loadResources() {
    const resources = this.app.get<Loader>('loader').getComponentsByType('resource') || [];
    for (const resource of resources) {
      this.bindStereotype(resource, false);
    }
  }

  private loadEntities() {
    const entities = this.app.get<Loader>('loader').getComponentsByType('entity') || [];
    for (const entity of entities) {
      this.bindStereotype(entity, false);
    }
  }

  private bindStereotype(Concrete: any, isShare = true) {
    // bind
    this.app.bind(Concrete, Concrete, isShare);
    const injectionName: string | undefined = Reflect.getMetadata('name', Concrete);
    if (injectionName) {
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
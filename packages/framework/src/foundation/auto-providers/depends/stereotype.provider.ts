import { BaseProvider } from '../../../base';
import { provide } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Loader } from '../../../loader';
// import { Str } from '../../../utils/str';
import { ControllerService } from '../../../controller/controller-service';
import { Application } from '../../application';
import { MiddlewareService } from '../../../http/middleware/middleware-service';
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
    const components = this.app.get<Loader>('loader').getComponentsWithFileByType('job') || [];
    for (const { target, file } of components) {
      this.bindStereotype(target, file, false);
    }
  }

  private loadControllers() {
    const controllers = this.app.get<Loader>('loader').getComponentsWithFileByType('controller') || [];
    for (const { target, file } of controllers) {
      this.bindStereotype(target, file, false);
      this.app.get<ControllerService>(ControllerService).register(target);
    }
  }

  private loadComponents() {
    const components = this.app.get<Loader>('loader').getComponentsWithFileByType('component') || [];
    for (const { target, file } of components) {
      this.bindStereotype(target, file, false);
    }
  }

  private loadMiddlewares() {
    const middlewares = this.app.get<Loader>('loader').getComponentsWithFileByType('middleware') || [];
    for (const { target, file } of middlewares) {
      Reflect.defineMetadata(symbols.DISABLE_INJECT, true, target, 'resolve');
      this.bindStereotype(target, file, true);
    }
  }

  private loadServices() {
    const services = this.app.get<Loader>('loader').getComponentsWithFileByType('service') || [];
    for (const { target, file } of services) {
      this.bindStereotype(target, file, false);
    }
  }

  private loadValidators() {
    const validators = this.app.get<Loader>('loader').getComponentsWithFileByType('validator') || [];
    for (const { target, file } of validators) {
      this.bindStereotype(target, file, false);
    }
  }

  private loadResources() {
    const resources = this.app.get<Loader>('loader').getComponentsWithFileByType('resource') || [];
    for (const { target, file } of resources) {
      this.bindStereotype(target, file, false);
    }
  }

  private loadEntities() {
    const entities = this.app.get<Loader>('loader').getComponentsWithFileByType('entity') || [];
    for (const { target, file } of entities) {
      this.bindStereotype(target, file, false);
    }
  }

  private bindStereotype(Concrete: any, file: string, isShare = true) {
    // bind
    this.app.bind(Concrete, Concrete, isShare);
    this.app.bindPath(Concrete, file);
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
import { Container } from '../../../container';
import { AppendAgent, Provide, Provider } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Loader } from '../../../loader';
// import { Str } from '../../../utils/str';
import { ControllerService } from '../../../controller';
import { Application } from '../../../foundation/application';
import { MiddlewareService } from '../../../http/middleware';
import { ScheduleService } from '../../../supports/schedule';
import * as symbols from '../../../symbol';

@Provider()
@AppendAgent()
export class StereotypeProvider implements ProviderInterface {

  protected get app(): Application {
    return Container.get('app');
  }

  @Provide(ControllerService)
  _controller(app: Application) {
    return new ControllerService(app);
  }

  /**
     * auto provide MiddlewareService
     * @param app
     */
  @Provide(MiddlewareService)
  _middleware(app: Application) {
    return new MiddlewareService(app);
  }

  /**
     * auto provide MiddlewareService
     * @param app
     */
  @Provide('middleware')
  _middlewareAlias(app: Application) {
    return app.get(MiddlewareService);
  }

  launch() {
    this.loadComponents();
    this.loadServices();
    this.loadMiddlewares();
    this.loadControllers();
    this.loadAgents();
    this.loadSchedules();
    this.loadValidators();
    this.loadResources();
  }

  private loadAgents() {
    const agents = this.app.get<Loader>('loader').getComponentsWithFileByType('agent') || [];
    for (const { target, file } of agents) {
      this.bindStereotype(target, file, true);
      this.app.tag(target, 'agent');
    }
  }

  private loadControllers() {
    const controllers = this.app.get<Loader>('loader').getComponentsWithFileByType('controller') || [];
    for (const { target, file } of controllers) {
      this.bindStereotype(target, file, false);
      this.app.tag(target, 'controller');
      this.app.get<ControllerService>(ControllerService).register(target);
    }
  }

  private loadComponents() {
    const components = this.app.get<Loader>('loader').getComponentsWithFileByType('component') || [];
    for (const { target, file } of components) {
      this.bindStereotype(target, file, false);
      this.app.tag(target, 'component');
    }
  }

  private loadMiddlewares() {
    const middlewares = this.app.get<Loader>('loader').getComponentsWithFileByType('middleware') || [];
    for (const { target, file } of middlewares) {
      Reflect.defineMetadata(symbols.DISABLE_INJECT, true, target, 'resolve');
      this.bindStereotype(target, file, true);
      this.app.tag(target, 'middleware');
    }
  }

  private loadServices() {
    const services = this.app.get<Loader>('loader').getComponentsWithFileByType('service') || [];
    for (const { target, file } of services) {
      this.bindStereotype(target, file, false);
      this.app.tag(target, 'service');
    }
  }

  private loadSchedules() {
    const schedules = this.app.get<Loader>('loader').getComponentsWithFileByType('schedule') || [];
    for (const { target, file } of schedules) {
      this.bindStereotype(target, file, true);
      this.app.tag(target, 'schedule');
      this.app.get<ScheduleService>(ScheduleService).register(target);
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

  private bindStereotype(Concrete: any, file: string, isShare = true) {
    this.app.bind(Concrete, Concrete, isShare);
    this.app.bindPath(Concrete, file);
    const injectionName: string | undefined = Reflect.getMetadata('name', Concrete);
    if (injectionName) {
      if (this.app.has(injectionName)) {
        const type: string | undefined = Reflect.getMetadata('type', Concrete);
        throw new Error(`specified ${type} name ${injectionName} conflicts with existing!`);
      }
      this.app.bind(injectionName, (...args: any[]) => {
        return this.app.get(Concrete, args);
      }, isShare, true);
    }
  }
}
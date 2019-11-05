// import { Container } from '../container';
import { Application } from '../foundation/application';
import { Loader } from '../loader';
import { ControllerManager } from '../controller';
// import { ModelManager } from '../model';


export class Resolver {
  
  /**
   * application instance
   */
  app: Application ;

  /**
   * Loader instance
   */
  loader: Loader;

  constructor(loader: Loader, app: Application) {
    this.app = app;
    this.loader = loader;
  }

  /**
   * resolve all
   */
  resolveAllModules() {
    this.resolveMiddlewares();
    this.resolveServices();
    this.resolveResources();
    this.resolveValidators();
    this.resolveComponents();
    this.resolveModels();
    this.resolveControllers();
  }

  /**
   * resolve middleware components
   */
  resolveMiddlewares() {
    const { middlewares } = this.loader;
    for (const Middleware of middlewares) {
      const name = Reflect.getMetadata('name', Middleware);
      this.app.singleton(Middleware, Middleware);
      if (name) {
        this.app.multiton(`middleware.${name}`, (...args: any[]) => {
          return this.app.get(Middleware, args);
        }, true);
      }
    }
    return this;
  }

  /**
   * resolve controllers
   */
  resolveControllers() {
    const { controllers } = this.loader;
    for (const Controller of controllers) {
      this.app.multiton(Controller, Controller);
      this.app.get<ControllerManager>('controller-manager').register(Controller);
    }
    return this;
  }

  /**
   * resolve model components
   */
  resolveModels() {
    const { models } = this.loader;
    for (const Model of models) {
      const name = Reflect.getMetadata('name', Model);
      this.app.singleton(Model, Model);
      if (name) {
        this.app.multiton(`model.${name}`, (...args: any[]) => {
          return this.app.get(Model, args);
        }, true);
      }
    }
  }

  /**
   * resolve service components
   */
  resolveServices() {
    const { services } = this.loader;
    for (const Service of services) {
      const name = Reflect.getMetadata('name', Service);
      this.app.singleton(Service, Service);
      if (name) {
        this.app.multiton(`service.${name}`, (...args: any[]) => {
          return this.app.get(Service, args);
        }, true);
      }
    }
  }

  /**
   * resolve validator components
   */
  resolveValidators() {
    const { validators } = this.loader;
    for (const Validator of validators) {
      const name = Reflect.getMetadata('name', Validator);
      this.app.singleton(Validator, Validator);
      if (name) {
        this.app.multiton(`validator.${name}`, (...args: any[]) => {
          return this.app.get(Validator, args);
        }, true);
      }
    }
  }

  /**
   * resolve resource components
   */
  resolveResources() {
    const { resources } = this.loader;
    for (const Resource of resources) {
      const name = Reflect.getMetadata('name', Resource);
      this.app.singleton(Resource, Resource);
      if (name) {
        this.app.multiton(`resource.${name}`, (...args: any[]) => {
          return this.app.get(Resource, args);
        }, true);
      }
    }
  }

  resolveComponents() {
    const { components } = this.loader;
    for (const Component of components) {
      const name = Reflect.getMetadata('name', Component);
      this.app.singleton(Component, Component);
      if (name) {
        this.app.multiton(`component.${name}`, (...args: any[]) => {
          return this.app.get(Component, args);
        }, true);
      }
    }
  }
}
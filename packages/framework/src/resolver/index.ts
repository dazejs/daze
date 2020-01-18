// import { Container } from '../container';
import { ControllerManager } from '../controller';
import { Application } from '../foundation/application';
import { Loader } from '../loader';
import { ComponentType } from '../symbol';

export class Resolver {
  
  /**
   * application instance
   */
  app: Application ;

  /**
   * Loader instance
   */
  loader: Loader;

  loadedComponents: Map<string, any>;

  constructor(loader: Loader, app: Application) {
    this.app = app;
    this.loader = loader;
    this.loadedComponents = app.get('loaded-components') || new Map();
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
    const middlewares = this.loadedComponents.get(ComponentType.Middleware) || [];
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
    const controllers = this.loadedComponents.get(ComponentType.Controller) || [];
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
    const entities = this.loadedComponents.get(ComponentType.Entity) || [];
    for (const Entity of entities) {
      const name = Reflect.getMetadata('name', Entity);
      this.app.multiton(Entity, Entity);
      if (name) {
        this.app.multiton(`entity.${name}`, (...args: any[]) => {
          return this.app.get(Entity, args);
        }, true);
      }
    }
  }

  /**
   * resolve service components
   */
  resolveServices() {
    const services = this.loadedComponents.get(ComponentType.Service) || [];
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

  /**
   * resolve validator components
   */
  resolveValidators() {
    const validators = this.loadedComponents.get(ComponentType.Validator) || [];
    for (const Validator of validators) {
      const name = Reflect.getMetadata('name', Validator);
      this.app.multiton(Validator, Validator);
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
    const resources = this.loadedComponents.get(ComponentType.Resource) || [];
    for (const Resource of resources) {
      const name = Reflect.getMetadata('name', Resource);
      this.app.multiton(Resource, Resource);
      if (name) {
        this.app.multiton(`resource.${name}`, (...args: any[]) => {
          return this.app.get(Resource, args);
        }, true);
      }
    }
  }

  resolveComponents() {
    const components = this.loadedComponents.get(ComponentType.Component) || [];
    for (const Component of components) {
      const name = Reflect.getMetadata('name', Component);
      this.app.multiton(Component, Component);
      if (name) {
        this.app.multiton(`component.${name}`, (...args: any[]) => {
          return this.app.get(Component, args);
        }, true);
      }
    }
  }
}
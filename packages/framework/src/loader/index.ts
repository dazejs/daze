/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import path from 'path';
// import fs from 'fs';
import glob from 'glob';
import { VerifyCsrfToken } from '../foundation/middlewares';
import { ComponentType } from '../symbol';
import { Application } from '../foundation/application';
import {
  Controller,
  Service,
  Validator,
  Resource,
  Middleware,
} from '../base';
import { Model } from '../model';

export class Loader {
  /**
   * @var app Application
   */
  app: Application;

  /**
   * @var controllers
   */
  controllers: typeof Controller[] = [];

  /**
   * @var middlewares
   */
  middlewares: typeof Middleware[] = [
    VerifyCsrfToken
  ];

  /**
   * @var validators
   */
  validators: typeof Validator[] = [];

  /**
   * @var services
   */
  services: typeof Service[] = [];

  /**
   * @var resources
   */
  resources: typeof Resource[] = [];

  /**
   * @var models
   */
  models: typeof Model[] = [];

  /**
   * @var components
   */
  components: any[] = [];

  /**
   * Create AutoScan Instance
   */
  constructor(app: Application) {
    /**
     * @var app Application
     */
    this.app = app;
  }

  async autoScanApp() {
    await this.scan(this.app.appPath);
  }

  async scan(absoluteFilePath: string) {
    const filePaths = glob.sync(path.join(absoluteFilePath, '**'), {
      nodir: true,
    });
    for (const file of filePaths) {
      const Target = (await import(file)).default;
      this.load(Target);
    }
    return this;
  }

  // /**
  //  * resolve auto scan
  //  */
  // async resolve() {
  //   // register middlewares
  //   // middlewares must be registed before controller
  //   this.registerMiddlewares();
  //   // register components
  //   this.registerComponents();
  //   // register controllers
  //   this.registerControllers();
  //   this.registerModels();
  // }

  /**
   * parse file module
   */
  load(Target: any) {
    if (!Target || !Target.prototype) return;
    // ignore @Ignore() decorator s target
    const isIgnore: boolean = Reflect.getMetadata('ignore', Target);
    if (isIgnore === true) return;
    const type: ComponentType = Reflect.getMetadata('type', Target);
    switch (type) {
      case ComponentType.Controller:
        this.controllers.push(Target);
        break;
      case ComponentType.Model:
        this.models.push(Target);
        break;
      case ComponentType.Middleware:
        this.middlewares.push(Target);
        break;
      case ComponentType.Service:
        this.services.push(Target);
        break;
      case ComponentType.Resource:
        this.resources.push(Target);
        break;
      case ComponentType.Validator:
        this.validators.push(Target);
        break;
      case ComponentType.Component:
        this.components.push(Target);
        break;
      default:
        break;
    }
    return this;
  }

  // /**
  //  * load Middleware
  //  */
  // loadMiddleware(target: any) {
  //   const name = Reflect.getMetadata('name', target);
  //   if (!name) return;
  //   this.app.bind(`middleware.${name}`, target);
  // }

  // /**
  //  * register middlewares
  //  */
  // registerMiddlewares() {
  //   for (const middleware of this.middlewares) {
  //     this.loadMiddleware(middleware);
  //   }
  // }

  // /**
  //  * register controllers
  //  */
  // registerControllers() {
  //   for (const controller of this.controllers) {
  //     this.app.get('controller').register(controller);
  //   }
  // }

  // /**
  //  * register controllers
  //  */
  // registerModels() {
  //   for (const Model of this.models) {
  //     this.app.get('model-manager').register(
  //       new Model()
  //     );
  //   }
  // }

  // /**
  //  * register components
  //  */
  // registerComponents() {
  //   for (const component of this.components) {
  //     const name = Reflect.getMetadata('name', component);
  //     const type = Reflect.getMetadata('type', component);
  //     if (name && type) {
  //       this.app.bind(`${type}.${name}`, component);
  //     }
  //   }
  // }
}

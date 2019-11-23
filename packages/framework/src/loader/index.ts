/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as glob from 'glob';
import * as path from 'path';

import { Controller, Middleware, Resource, Service, Validator, Entity } from '../base';
import { Application } from '../foundation/application';
import { VerifyCsrfToken } from '../foundation/middlewares';
import { ComponentType } from '../symbol';


// import fs from 'fs';
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
    VerifyCsrfToken,
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
   * @var entities
   */
  entities: typeof Entity[] = [];

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
      case ComponentType.Entity:
        this.entities.push(Target);
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
}

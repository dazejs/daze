/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import path from 'path'
import glob from 'glob'
import { VerifyCsrfToken } from '../foundation/middlewares'
import { ComponentType } from '../symbol'

export class Loader {

  app: any;
  controllers: any[];
  middlewares: any[];
  components: any[];
  /**
   * Create AutoScan Instance
   */
  constructor(app: any) {
    /**
     * @var {object} app Application
     */
    this.app = app;

    /**
     * @var controllers controllers
     */
    this.controllers = [];

    /**
     * 默认加载的中间件
     * @var middlewares middlewares
     */
    this.middlewares = [
      VerifyCsrfToken,
    ];

    /**
     * @var components components
     */
    this.components = [];
  }

  /**
   * auto scan app dir
   */
  async autoLoadApp() {
    const appFiles = glob.sync(path.resolve(this.app.appPath, '**'), {
      nodir: true,
    });

    for (const file of appFiles) {
      await this.loadFile(file);
    }
  }

  /**
   * resolve auto scan
   */
  async resolve() {
    await this.autoLoadApp();
    // register middlewares
    // middlewares must be registed before controller
    this.registerMiddlewares();
    // register components
    this.registerComponents();
    // register controllers
    this.registerControllers();
  }

  /**
   * load file with filepath
   */
  async loadFile(filePath: string) {
    const target = (await import(filePath)).default;
    if (!target || !target.prototype) return;
    const isIgnore = Reflect.getMetadata('ignore', target.prototype);
    if (isIgnore === true) return;
    const type = Reflect.getMetadata('type', target.prototype);
    this.parseModule(target, type);
  }

  /**
   * parse file module
   */
  parseModule(target: any, type: ComponentType) {
    switch (type) {
      case ComponentType.Controller:
        this.controllers.push(target);
        break;
      case ComponentType.Middleware:
        this.middlewares.push(target);
        break;
      case ComponentType.Service:
      case ComponentType.Resource:
      case ComponentType.Validator:
      case ComponentType.Component:
        this.components.push(target);
        break;
      default:
        break;
    }
  }

  /**
   * load Middleware
   */
  loadMiddleware(target: any) {
    const name = Reflect.getMetadata('name', target.prototype);
    if (!name) return;
    this.app.bind(`middleware.${name}`, target);
  }

  /**
   * register middlewares
   */
  registerMiddlewares() {
    for (const middleware of this.middlewares) {
      this.loadMiddleware(middleware);
    }
  }

  /**
   * register controllers
   */
  registerControllers() {
    for (const controller of this.controllers) {
      this.app.get('controller').register(controller);
    }
  }

  /**
   * register components
   */
  registerComponents() {
    for (const component of this.components) {
      const name = Reflect.getMetadata('name', component.prototype);
      const type = Reflect.getMetadata('type', component.prototype);
      if (name && type) {
        this.app.bind(`${type}.${name}`, component);
      }
    }
  }
}

/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as glob from 'glob';
import * as path from 'path';
import { Application } from '../foundation/application';
import { VerifyCsrfToken } from '../foundation/middlewares';
import { ComponentType } from '../symbol';


export class Loader {
  /**
   * @var app Application
   */
  app: Application;

  /**
   * loaded components
   */
  loadedComponents: Map<string, any[]> = new Map([
    [ComponentType.Middleware, [VerifyCsrfToken]]
  ]);

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

  /**
   * scan dir
   * @param absoluteFilePath 
   */
  async scan(absoluteFilePath: string) {
    const filePaths = glob.sync(path.join(absoluteFilePath, '**/*.@(js|ts)'), {
      nodir: true,
      matchBase: true
    });
    for (const file of filePaths) {
      const Target = (await import(file)).default;
      this.load(Target);
    }
    return this;
  }

  /**
   * get component by type
   * @param type 
   */
  getComponentByType(type: string) {
    return this.loadedComponents.get(type);
  }
  
  /**
   * parse file module
   */
  load(Target: any) {
    if (!Target || !Target.prototype) return;
    // ignore @Ignore() decorator s target
    const isIgnore: boolean = Reflect.getMetadata('ignore', Target);
    if (isIgnore === true) return;
    const type: ComponentType = Reflect.getMetadata('type', Target) ?? 'component';
    if (this.loadedComponents.has(type)) {
      this.loadedComponents.get(type)?.push(Target);
    } else {
      this.loadedComponents.set(type, [Target]);
    }
    return this;
  }
}

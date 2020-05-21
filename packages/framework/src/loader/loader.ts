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

export class Loader {
  /**
   * @var app Application
   */
  app: Application;

  /**
   * loaded components
   */
  loadedComponents: Map<string, any[]> = new Map([
    ['middleware', [VerifyCsrfToken]]
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
    const filePaths = glob.sync(path.join(absoluteFilePath, '**/*.@(ts|js)'), {
      nodir: true,
      matchBase: true
    });
    for (const file of filePaths) {
      if (file.slice(-5) !== '.d.ts') {
        const Target = (await import(file));
        Object.keys(Target)
          .filter((k) => typeof Target[k] === 'function')
          .forEach((k) => {
            this.load(Target[k]);
          });
      }
    }
    return this;
  }

  /**
   * get component by type
   * @deprecated
   * @param type 
   */
  getComponentByType(type: any) {
    return this.loadedComponents.get(type);
  }

  /**
   * get component by type
   * @param type 
   */
  getComponentsByType(type: any) {
    return this.loadedComponents.get(type);
  }

  /**
   * parse file module
   */
  load(Target: any) {
    if (!Target || !Target.prototype) return;
    // check if injectable
    const injectable = Reflect.getMetadata('injectable', Target);
    if (injectable !== true) return;
    // ignore @Ignore() decorator s target
    const isIgnore: boolean = Reflect.getMetadata('ignore', Target);
    if (isIgnore === true) return;
    const type: string = Reflect.getMetadata('type', Target) ?? 'component';
    if (this.loadedComponents.has(type)) {
      this.loadedComponents.get(type)?.push(Target);
    } else {
      this.loadedComponents.set(type, [Target]);
    }
    return this;
  }
}

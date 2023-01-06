/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as glob from 'glob';
import * as path from 'path';
import { Application } from '../foundation/application';
import { Container } from '../container';
 
/**
  * 模块加载器
  */
export class Loader {
  /**
      * @var app Application
      */
  private app: Application = Container.get('app');
 
  /**
      * 已加载的模块
      */
  public loadedComponents: Map<string, {
    target: any,
    file: string
  }[]> = new Map();
 
  /**
      * 自动根据配置扫描项目目录
      */
  public async autoScanApp() {
    await this.scan(this.app.appPath);
  }
 
  /**
      * 扫描目录
      * @param absoluteFilePath
      */
  public async scan(absoluteFilePath: string) {
    const filePaths = glob.sync(path.join(absoluteFilePath, '**/*.@(ts|js)'), {
      nodir: true,
      matchBase: true
    });
    for (const file of filePaths) {
      if (file.slice(-5) !== '.d.ts') {
        const Target = (await import(`${file}`));
        Object.keys(Target)
          .filter((k) => typeof Target[k] === 'function')
          .forEach((k) => {
            this.load(Target[k], file);
          });
      }
    }
    return this;
  }
 
  /**
      * 根据类型获取模块数组
      * @param type
      */
  public getComponentsByType(type: any) {
    return this.loadedComponents.get(type)?.map(item => item.target);
  }
 
  /**
      * 根据类型获取模块和模块文件地址的数组
      * @param type
      * @returns
      */
  public getComponentsWithFileByType(type: any) {
    return this.loadedComponents.get(type);
  }
 
  /**
      * 解析模块
      */
  public load(Target: any, file: string) {
    if (!Target || !Target.prototype) return;
    // ignore @Ignore() decorator s target
    const isIgnore: boolean = Reflect.getMetadata('ignore', Target);
    // 如果加载了 env，则只有对应环境才会加载
    const env = Reflect.getMetadata('env', Target);
    if (isIgnore === true) return;
    if (env && env !== this.app.getEnv()) return;
    const type: string = Reflect.getMetadata('type', Target) ?? 'component';
    if (this.loadedComponents.has(type)) {
      this.loadedComponents.get(type)?.push({
        target: Target,
        file
      });
    } else {
      this.loadedComponents.set(type, [{
        target: Target,
        file
      }]);
    }
    return this;
  }
}
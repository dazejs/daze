import nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';
import fsExtra from 'fs-extra';
import pluralize from 'pluralize';
import chalk from 'chalk';
import fetch from 'node-fetch';

export type SourceType = 'application' | 'controller' | 'service' | 'middleware' | 'entity' | 'schedule'
export type ExtSourceType = 'application_ssr_extra' | 'application_business_extra'

export class Render {
  private _sourcePath: SourceType;
  private _sourceExtPaths: ExtSourceType[];
  private _destinationPath: string;

  private _env: nunjucks.Environment;
  private _templatePath = path.resolve(__dirname, '../../template');

  private _isSSr = false;
  private _isBusiness = false;

  private _assigns: any = {
    fetch,
  };

  constructor() {
    this._env = nunjucks.configure(this._templatePath, {
      trimBlocks: true,
      lstripBlocks: true
    });
    this._env.addFilter('firstUpperCase', function (str: string) {
      return str.replace(/\b(\w)/g, $1 => $1.toUpperCase());
    });
    this._env.addFilter('plural', function (str: string) {
      return pluralize.plural(str);
    });
    this._env.addFilter('removeSplit', function (str: string) {
      return str.replace(/\//g, '');
    });
  }

  public source(sourcePath: SourceType) {
    this._sourcePath = sourcePath;
    return this;
  }

  public sourceExt(sourcePath: ExtSourceType) {
    if (!this._sourceExtPaths) this._sourceExtPaths = [];
    if (this._sourceExtPaths.includes(sourcePath)) return this;
    this._sourceExtPaths.push(sourcePath);
    return this;
  }

  /**
     * SSR 模式
     * @returns 
     */
  public ssr() {
    this._isSSr = true;
    return this;
  }

  /**
     * 业务工程
     * @returns 
     */
  public business() {
    this._isSSr = true;
    this._isBusiness = true;
    return this;
  }

  public destination(destinationPath: string) {
    this._destinationPath = destinationPath;
    return this;
  }

  public assign(name: string, value: any): this
  public assign(name: object): this
  public assign(name: string | object, value?: any) {
    if (typeof name === 'string') {
      this._assigns[name] = value;
    } else {
      this._assigns = {
        ...this._assigns,
        ...name
      };
    }
    return this;
  }

  public async make(srcFilename: string, distFilename: string, relationPath = 'app') {
    const sourcePath = path.join(this._templatePath, this._sourcePath);
    const file = path.join(sourcePath, srcFilename);
    const filename = path.join(
      process.cwd(),
      'src',
      relationPath,
      this._destinationPath,
      distFilename
    );

    const str = this._env.render(file, this._assigns);

    if (fs.existsSync(filename)) {
      console.log(chalk.red(`文件已存在!`));
      process.exit(1);
    }
    fsExtra.ensureFileSync(filename);
    fs.writeFileSync(filename, str, {
      encoding: 'utf-8'
    });
  }

  private writeFiles(sourcePath: string, files: string[]) {
    for (const file of files) {
      const filename = path.join(
        process.cwd(),
        this._destinationPath,
        path.relative(sourcePath, file)
      );
      const str = this._env.render(file, this._assigns);
      fsExtra.ensureFileSync(filename);
      fs.writeFileSync(filename, str, {
        encoding: 'utf-8',
      });
    }
  }

  public async apply() {
    const sourcePath = path.join(this._templatePath, this._sourcePath);
    if (fs.existsSync(path.join(process.cwd(), this._destinationPath, 'package.json'))) {
      console.log(chalk.red(`项目已存在!`));
      process.exit(1);
    }
       
    const files = glob.sync(
      path.join(sourcePath, '**'),
      {
        nodir: true,
        dot: true,
      }
    );

    const depens = [
      'reflect-metadata',
      '@tiger/common',
      '@tiger/base-provider'
    ];

    const devDepens = [
      '@tiger/cli',
      '@types/node',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint',
      'ts-node'
    ];
    // 用来存储一些特殊的版本的依赖
    const specifiedDepensMap: Record<string, string> = {};
    // ssr 模式需要的依赖
    if (this._isSSr) {
      depens.push('@tiger/ssr-provider');
      depens.push('react');
      depens.push('react-dom');
      devDepens.push('@types/react-router');
      devDepens.push('@types/react-router-dom');

      // 对于 react-router 很多组件不支持
      // 所以这边先写死了 5 的版本
      specifiedDepensMap['react-router'] = '^5.2.1';
      specifiedDepensMap['react-router-dom'] = '^5.3.0';
      // depens.push('react-router');
      // depens.push('react-router-dom');
    }

    // 业务模式需要的依赖
    if (this._isBusiness) {
      depens.push('@eagler/authorizion');
      depens.push('@ant-design/icons');
      depens.push('@eagler/icac-bu');
      depens.push('@sharkr/components');
      depens.push('@sharkr/util');
      depens.push('antd');
      depens.push('process');
    }
       
    const depensMap: Record<string, string> = {
      ...specifiedDepensMap
    };
    for (const dep of depens) {
      const version = await fetch(`http://npm.mail.netease.com/registry/-/package/${dep}/dist-tags`)
        .then(res => res.json()).then((tags) => tags.latest);
      depensMap[dep] = version;
    }

    const devDepensMap: Record<string, string> = {};
    for (const dep of devDepens) {
      const version = await fetch(`http://npm.mail.netease.com/registry/-/package/${dep}/dist-tags`).then(res => res.json()).then((tags) => tags.latest);
      devDepensMap[dep] = version;
    }

    this.assign('depensMap', depensMap);
    this.assign('devDepensMap', devDepensMap);
        
    this.writeFiles(sourcePath, files);

    // 渲染扩展文件
    if (this._sourceExtPaths) {
      for (const extPath of this._sourceExtPaths) {
        const extSourcePath = path.join(this._templatePath, extPath);
        const extFiles = glob.sync(
          path.join(extSourcePath, '**'),
          {
            nodir: true,
            dot: true,
          }
        );
        this.writeFiles(extSourcePath, extFiles);
      }
    }
  }
}
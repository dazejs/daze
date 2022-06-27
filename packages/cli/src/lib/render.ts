import nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';
import fsExtra from 'fs-extra';
import pluralize from 'pluralize';
import chalk from 'chalk';
import fetch from 'node-fetch';

export type SourceType = 'application' | 'controller' | 'service' | 'middleware' | 'entity'

export class Render {
  private _sourcePath: SourceType;
  private _destinationPath: string;

  private _env: nunjucks.Environment;
  private _templatePath = path.resolve(__dirname, '../../template')

  private _isSSr = false;

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
  }

  public source(sourcePath: SourceType) {
    this._sourcePath = sourcePath;
    return this;
  }

  public ssr() {
    this._isSSr = true;
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

  public async apply() {
    const sourcePath = path.join(this._templatePath, this._sourcePath);
    if (fs.existsSync(path.join(process.cwd(), this._destinationPath, 'package.json'))) {
      console.log(chalk.red(`项目已存在!`));
      process.exit(1);
    }
    const ignore = [];
    if (!this._isSSr) {
      ignore.push(path.join(sourcePath, 'web/**'));
    }
    const files = glob.sync(
      path.join(sourcePath, '**'),
      {
        nodir: true,
        dot: true,
        ignore
      }
    );

    const depens = [
      'reflect-metadata',
      '@dazejs/framework',
    ];

    const devDepens = [
      '@dazejs/cli',
      '@types/node',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint',
    ];

    if (this._isSSr) {
      depens.push('@dazejs/ssr-provider');
      depens.push('react');
      depens.push('react-dom');
      depens.push('react-router');
      depens.push('react-router-dom');
    }

    const depensMap: Record<string, string> = {};
    for (const dep of depens) {
      const version = await fetch(`https://registry.npmjs.org/-/package/${dep}/dist-tags`).then((res: any) => res.json()).then((tags: any) => tags.latest);
      depensMap[dep] = version;
    }

    const devDepensMap: Record<string, string> = {};
    for (const dep of devDepens) {
      const version = await fetch(`https://registry.npmjs.org/-/package/${dep}/dist-tags`).then((res: any) => res.json()).then((tags: any) => tags.latest);
      devDepensMap[dep] = version;
    }

    this.assign('depensMap', depensMap);
    this.assign('devDepensMap', devDepensMap);

    for (const file of files) {
      const filename = path.join(
        process.cwd(),
        this._destinationPath,
        path.relative(sourcePath, file)
      );
      const str = this._env.render(file, this._assigns);
      fsExtra.ensureFileSync(filename);
      fs.writeFileSync(filename, str, {
        encoding: 'utf-8'
      });
    }
  }
}
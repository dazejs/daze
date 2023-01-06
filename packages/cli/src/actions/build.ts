import { Application } from '@dazejs/framework';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { DAZE_SERVER_PREFIX } from '../lib/constants';
import { TsCompile } from '../lib/ts_compile';

const cwd = process.cwd();

/**
 * 开发模式 Action
 */
export class BuildAction {

  /**
     * 默认的 tsconfig 文件路径
     */
  private defaultTsConfigPath = path.join(__dirname, '../defaultTsConfig.json');

  /**
     * 项目自定义的 tsconfig 文件路径
     */
  private customTsConfigPath = path.join(cwd, './tsconfig.json');

  /**
     * 项目自定义的 client 特殊 tsconfig 文件路径
     */
  // private _customClientTsConfigPath = path.join(fePath, './tsconfig.json')

  /**
     * 项目自定义的 server 特殊 tsconfig 文件路径
     */
  private customServerTsConfigPath = path.join(cwd, './src', './tsconfig.json');


  /**
     * Action Hook
     */
  public async resolve(_destination: any) {
    const app = new Application({
      rootPath: path.join(cwd, './src')
    });
    await app.initializeForCli();

    this.resolveServer();
  }


  /**
     * 启动服务端测开发模式
     */
  private resolveServer() {
    if (fs.existsSync(path.join(cwd, './src'))) {
      console.log(DAZE_SERVER_PREFIX, '准备编译服务端代码...');
      if (fs.existsSync(this.customServerTsConfigPath)) {
        this._compile(this.customServerTsConfigPath);
      } else {
        if (fs.existsSync(this.customTsConfigPath)) {
          this._compile(this.customTsConfigPath);
        } else {
          this._compile(this.defaultTsConfigPath);
        }
      }
    }
  }

  private async _compile(configPath: string) {

    const tsCompile = new TsCompile();

    tsCompile.compile(configPath, (config) => {
      console.log(DAZE_SERVER_PREFIX, '编译成功');
      console.log(DAZE_SERVER_PREFIX, '输出目录: ', chalk.green(config.options.outDir));
    });
  }
}
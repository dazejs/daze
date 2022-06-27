import { TsCompile } from '../lib/ts_compile';
import { DAZE_SERVER_PREFIX, DAZE_CLIENT_PREFIX } from '../lib/constants';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { Bundler, fePath } from '@dazejs/ssr-bundler';
import { loadCustomConfig } from '../lib/config';
import { Application, Str } from '@dazejs/framework';

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
  private customServerTsConfigPath = path.join(cwd, './src', './tsconfig.json')


  /**
     * Action Hook
     */
  public async resolve(destination: any) {
    const app = new Application(path.join(cwd, './src'));
    await app.initializeForCli();

    if (destination.clientOnly || !destination.serverOnly) {
      this.resolveClient(destination, app.get('config').get('app.publicPrefix', '') + Str.formatPrefix('/static') + '/');
    }
    if (destination.serverOnly || !destination.clientOnly) {
      this.resolveServer();
    }
  }

  /**
     * 启动客户端侧开发模式
     */
  private async resolveClient(destination: any, publicPath: string) {
    if (fs.existsSync(fePath)) {
      console.log(DAZE_CLIENT_PREFIX, 'Ready to compile the client code...');
      const customConfig = await loadCustomConfig();
      const bundler = new Bundler({
        mpa: !destination.spa || !!destination.mpa,
        ssr: !destination.csr,
        log: (msg: string) => {
          console.log(DAZE_CLIENT_PREFIX, msg);
        },
        publicPath,
        customConfig
      });

      await bundler.build();
    }
  }

  /**
     * 启动服务端测开发模式
     */
  private resolveServer() {
    if (fs.existsSync(path.join(cwd, './src'))) {
      console.log(DAZE_SERVER_PREFIX, 'Ready to compile the server code...');
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
      console.log(DAZE_SERVER_PREFIX, 'Compile successfully');
      console.log(DAZE_SERVER_PREFIX, 'The output directory: ', chalk.green(config.options.outDir));
    });
  }
}
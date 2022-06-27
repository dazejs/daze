import { DAZE_SERVER_PREFIX, DAZE_CLIENT_PREFIX } from '../lib/constants';
import path from 'path';
import fs from 'fs';
import { Bundler, fePath } from '@dazejs/ssr-bundler';
import nodemon from 'nodemon';
import { loadCustomConfig } from '../lib/config';
import { Application, Str } from '@dazejs/framework';


const cwd = process.cwd();

/**
 * 开发模式 Action
 */
export class DevAction {

  /**
     * 默认的 tsconfig 文件路径
     */
  private defaultTsConfigPath = path.join(__dirname, '../defaultTsConfig.json');

  /**
     * 项目自定义的 tsconfig 文件路径
     */
  private customTsConfigPath = path.join(cwd, './tsconfig.json');

  /**
     * 项目自定义的 server 特殊 tsconfig 文件路径
     */
  private customServerTsConfigPath = path.join(cwd, './src', './tsconfig.json')

  /**
     * nodemon 实例
     */
  private script: typeof nodemon;


  /**
     * Action Hook
     */
  public async resolve(destination: any) {
    const app = new Application(path.join(cwd, './src'));
    await app.initializeForCli();

    if (destination.clientOnly || !destination.serverOnly) {
      await this.resolveClient(destination, app.get('config').get('app.publicPrefix', '') + Str.formatPrefix('/static') + '/');
    }
    if (destination.serverOnly || !destination.clientOnly) {
      this.resolveServer({
        debug: !!destination.debug
      });
    }
  }

  /**
     * 启动客户端侧开发模式
     */
  private async resolveClient(destination: any, publicPath: string) {
    if (fs.existsSync(fePath)) {
      console.log(DAZE_CLIENT_PREFIX, 'Ready to start client development mode...');
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
      bundler.on('restarted', () => {
        console.log(DAZE_SERVER_PREFIX, 'Restarting the service...');
                this.script?.restart();
      });
      await bundler.watch();
    }
  }

  /**
     * 启动服务端测开发模式
     */
  private resolveServer(options: {
    debug?: boolean;
  } = {}) {
    if (fs.existsSync(path.join(cwd, './src'))) {
      console.log(DAZE_SERVER_PREFIX, `Starting server developer mode...`);
      if (fs.existsSync(this.customServerTsConfigPath)) {
        this._dev(this.customServerTsConfigPath, options);
      } else {
        if (fs.existsSync(this.customTsConfigPath)) {
          this._dev(this.customTsConfigPath, options);
        } else {
          this._dev(this.defaultTsConfigPath, options);
        }
      }
    }
  }

  private _dev(configPath: string, options: {
    debug?: boolean;
    noUpdateNotifier?: boolean;
  } = {}) {
    this.script = nodemon({
      restartable: 'rs',
      script: path.join(cwd, './src/index'),
      exec: 'ts-node',
      ext: 'ts,js,jsx,tsx',
      args: ['--source-map', '--preserve-symlinks', '--show-config', '--files'],
      env: {
        DEBUG: options.debug ? '@dazejs/*' : '',
        TS_NODE_PROJECT: configPath
      },
      ignore: ['node_modules/'],
      stdin: true,
      watch: [path.join(cwd, './src/')],
      signal: 'SIGTERM' as any,
    });
    this.script.on('log', (data) => {
      if (data.type === 'error') {
        console.log(data.colour);
      }
    });
    process.once('SIGINT', () => {
      this.script.emit('quit');
      (this.script as any).quitEmitted = true;
    });
    this.script.on('exit', () => {
      // Ignore exit event during restart
      if ((this.script as any).quitEmitted) {
        process.exit(0);
      }
    });
  }
}
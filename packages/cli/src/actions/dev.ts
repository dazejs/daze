import { Application } from '@dazejs/framework';
import chokidar from 'chokidar';
import fs from 'fs';
import nodemon from 'nodemon';
import path from 'path';
import { DAZE_SERVER_PREFIX } from '../lib/constants';


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
  private customServerTsConfigPath = path.join(cwd, './src', './tsconfig.json');

  /**
     * nodemon 实例
     */
  private script: typeof nodemon;
    

  app: Application;

  watcher: chokidar.FSWatcher;


  /**
     * Action Hook
     */
  public async resolve(destination: any) {
    this.app = new Application({
      rootPath: path.join(cwd, './src')
    });
    await this.app.initializeForCli();
    this.resolveServer({
      debug: !!destination.debug,
      inspect: destination.inspect
    });
  }

  /**
     * 启动服务端测开发模式
     */
  private resolveServer(options: {
    debug?: boolean;
    inspect?: string;
  } = {}) {
    if (fs.existsSync(path.join(cwd, './src'))) {
      console.log(DAZE_SERVER_PREFIX, `正在启动服务端开发者模式...`);
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

  private async _dev(configPath: string, options: {
    debug?: boolean;
    noUpdateNotifier?: boolean;
    inspect?: string;
  } = {}) {
    // const rootPath = path.join(cwd, './src');
    // console.log(rootPath, 'rootPath');
    // this.watcher = chokidar.watch(rootPath, {
    //     ignoreInitial: true
    // });
    // process.env.TIGER_ROOT_PATH = rootPath;
    // await import(rootPath);
    // const app: Application = Container.instance;
    // app.on('ready', () => {
    //     this.watcher.on('change', () => {
    //         console.log(DAZE_SERVER_PREFIX, `服务端文件发生变更, 正在重启 Node 服务...`);
    //         app.reload();
    //     });
    //     console.log(DAZE_SERVER_PREFIX, `Node 服务已启动: ${app.port}`);
    // });

    const inspect = options.inspect;

    // return;
    this.script = nodemon({
      restartable: 'rs',
      script: path.join(cwd, './src/index'),
      ext: 'ts,js,jsx,tsx',
      args: ['--source-map', '--preserve-symlinks', '--show-config', '--files'],
      env: {
        DEBUG: options.debug ? '@dazejs/*' : '',
        TS_NODE_PROJECT: configPath,
        NODE_OPTIONS: "-r ts-node/register --no-warnings"
      },
      nodeArgs: [inspect ? `--inspect${typeof inspect === 'string' ? `=${inspect}` : ''}` : ''],
      ignore: ['node_modules/'],
      stdin: true,
      watch: [path.join(cwd, './src/')],
      signal: 'SIGTERM' as any,
    });
    this.script.on('log', (data: any) => {
      console.log(data.colour);
      if (data.type === 'error') {
        // console.log(data.colour);
      }
    });
    process.once('SIGINT',  () => {
      this.script.emit('quit');
      (this.script as any).quitEmitted = true;
    });
    this.script.on('exit',  () => {
      // Ignore exit event during restart
      if ((this.script as any).quitEmitted) {
        process.exit(0);
      }
    });
  }
}
/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import cluster, { Worker as ClusterWorker } from 'cluster';
import { Server } from 'http';
import Keygrip from 'keygrip';
import * as path from 'path';
import * as fs from 'fs';
import mainFilename from 'require-main-filename';
import * as util from 'util';
import * as winston from 'winston';
import { Master, Worker } from '../cluster';
import { Config } from '../config';
import { Job } from '../job';
import { Container } from '../container';
import { Database } from '../database';
import { Loader } from '../loader';
import { ErrorCollection } from '../errors/handle';
import { Logger } from '../logger';
import { Provider } from '../provider';
import { WorkerProvider, CommonProvider } from './auto-providers';
import { AppServer } from '../http/server';
import { MessengerService } from '../messenger';
import { HttpsOptions } from '../interfaces/external/https-options';
import { MiddlewareService } from '../http/middleware';
import debuger from 'debug';
import { DAZE_PROCESS_TYPE } from '../cluster/const';

const debug = debuger('@dazejs/framework:application');

const DEFAULT_PORT = 8080;

const envMap = new Map([
  ['development', 'dev'],
  ['test', 'test'],
  ['production', 'prod'],
]);

export interface ApplicationPathsOptions {
  app?: string;
  config?: string;
  view?: string;
  public?: string;
  log?: string;
  storeage?: string;
}

interface ApplicationCreateOption {
  rootPath?: string;
  paths?: ApplicationPathsOptions;
  providers?: Function[];
}

export class Application extends Container {
  /**
   * The base path for the Application installation.
   */
  rootPath = '';

  /**
   * The app workspace path
   */
  appPath = '';

  /**
   * The config file path
   */
  configPath = '';

  /**
   * The views file path
   */
  viewPath = '';

  /**
   * The public file path
   */
  publicPath = '';

  /**
   * The log file path
   */
  logPath = '';

  /**
   * storeage Path
   */
  storeagePath = '';

  /**
   * keygrip keys
   */
  keys: any[] = [];

  /**
   * http Server
   */
  _server?: Server;

  /**
   * The config instance
   */
  config: Config;

  /**
   * application run port
   */
  port = 0;

  /**
   * debug enabled?
   */
  isDebug = false;

  /**
   * needs to parse body
   */
  needsParseBody = true;

  /**
   * needs session
   */
  needsSession = true;

  /**
   * needs static server
   */
  needsStaticServer = true;

  /**
   * provider launch calls
   */
  launchCalls: ((...args: any[]) => any)[] = [];

  /**
   * is https
   */
  isHttps = false;

  /**
   * https Options
   */
  httpsOptions?: HttpsOptions;

  /**
   * 全局路由
   */
  public middlewares: {
    middleware: any;
    args: any[];
  }[] = [];

  /**
   * init providers
   */
  private static initProviders: Function[] = [];

  /**
   * Create Application Instance
   * @param rootPath
   * @param paths
   */
  constructor(rootPath?: string, paths: ApplicationPathsOptions = {}) {
    super();
    this.initDirectoryStructure(rootPath, paths);
    this.initContainer();
    this.initConfig();
    this.initProvider();
  }

  /**
     * 根据应用参数初始化目录结构
     * @param paths
     */
  private initDirectoryStructure(rootPath?: string, paths?: ApplicationPathsOptions): this {
    if (!rootPath) {
      const _filename = mainFilename();
      if (_filename) {
        this.rootPath = path.dirname(_filename);
      } else {
        throw new Error('Application: 无法找到默认应用根目录，请显式的传入应用根目录参数');
      }
    } else {
      this.rootPath = rootPath;
    }
    this.appPath = path.resolve(this.rootPath, paths?.app || 'app');
    this.configPath = path.resolve(this.rootPath, paths?.config || 'config');
    this.viewPath = path.resolve(this.rootPath, paths?.view || '../views');
    this.publicPath = path.resolve(this.rootPath, paths?.public || '../public');
    this.storeagePath = path.resolve(this.rootPath, paths?.storeage || '../storeage');
    this.logPath = path.resolve(this.rootPath, paths?.log || '../logs');

    return this;
  }

  /**
     * 初始化配置解析器
     */
  private initConfig(): void {
    this.singleton(Config, Config);
    this.singleton('config', () => {
      return this.get(Config);
    }, true);
  }


  /**
   * initial Container
   */
  private initContainer(): void {
    Container.setInstance(this);
    this.bind('app', this);
  }

  /**
   * 初始化服务提供者解析器
   */
  private initProvider(): void {
    this.singleton('loader', () => {
      return new Loader();
    }, true);
    this.singleton(Loader, () => {
      return this.get('loader');
    }, true);
    this.singleton('provider', Provider);
  }

  /**
   * 配置应用程序
   * @returns 
   */
  private async setupApp() {
    debug(`准备配置应用程序`);
    this.config = this.get('config');
    await this.config.initialize(this.configPath);
    if (!this.port) this.port = this.config.get('app.port', DEFAULT_PORT);
    if (process.env.NODE_ENV === 'development' || process.env.DAZE_ENV === 'dev') {
      this.isDebug = this.config.get('app.debug', false);
    }
    if (this.isCluster) this.make('messenger');
    debug(`配置应用程序已完成`);
  }

  /**
   * disable body parser
   */
  disableBodyParser() {
    this.needsParseBody = false;
  }

  /**
   * disable session
   */
  disableSession() {
    this.needsSession = false;
  }

  /**
   * disable static server
   */
  disableStaticServer() {
    this.needsStaticServer = false;
  }

  getWorkers() {
    const workers: ClusterWorker[] = [];
    for (const id in cluster.workers) {
      const worker = cluster.workers[id];
      if ((worker as any)[DAZE_PROCESS_TYPE] === 'worker')
        worker && workers.push(worker);
    }
    return workers;
  }

  getAgent() {
    for (const id in cluster.workers) {
      const worker = cluster.workers[id];
      if ((worker as any)[DAZE_PROCESS_TYPE] === 'agent')
        return worker;
    }
    return;
  }

  /**
   * 判断进程是否 agent 进程类型
   */
  public get isAgent() {
    return !cluster.isMaster && process.env.DAZE_PROCESS_TYPE === 'agent';
  }

  /**
   * 判断进程是否 worker 进程类型
   */
  public get isWorker() {
    return !cluster.isMaster && process.env.DAZE_PROCESS_TYPE === 'worker';
  }

  /**
   * 判断进程是否 worker 进程类型
   */
  public get isMaster() {
    return cluster.isMaster;
  }

  /**
   * register base provider
   */
  async registerCommonProviders(): Promise<void> {
    await this.register(CommonProvider);
    // this.bind(Request, (request: Request) => request, false, true);
  }

  /**
   * register vendor providers
   * @private
   */
  private async registerVendorProviders(): Promise<void> {
    const _providers = this.config.get('app.providers', []);
    for (const key of _providers) {
      await this.register(key);
    }
  }

  /**
   * register static init providers
   */
  private async registerInitProviders(): Promise<void> {
    for (const Provider of Application.initProviders) {
      await this.register(Provider);
    }
  }

  /**
     * 注册自动加载的第三方依赖服务
     */
  private async registerAutoProviders(): Promise<void> {
    const packageJsonPath = path.join(this.rootPath, '../package.json');
    if (!fs.existsSync(packageJsonPath)) return;
    const json = await import(`${packageJsonPath}`);
    if (!json?.dependencies) return;
    const dependencies = Object.keys(json.dependencies);
    await this.registerAutoProviderDependencies(dependencies);
  }

  /**
     * 注册自动加载的第三方依赖服务
     * @param dependencies 
     */
  private async registerAutoProviderDependencies(dependencies: string[]) {
    for (const depend of dependencies) {
      const dependPackagePath = path.join(this.rootPath, '../node_modules', depend, 'package.json');
      if (fs.existsSync(dependPackagePath)) {
        const dependJson = await import(`${dependPackagePath}`);
        if (dependJson?.['dazeProviders'] && Array.isArray(dependJson['dazeProviders'])) {
          for (const providerPath of dependJson['dazeProviders']) {
            const providerAbsolutPath = path.join(this.rootPath, '../node_modules', depend, providerPath);
            try {
              const AutoThridProvider = await import(`${providerAbsolutPath}`);
              const keys = Object.keys(AutoThridProvider).filter((k) => typeof AutoThridProvider[k] === 'function');
              for (const k of keys) {
                if (!this.has(AutoThridProvider[k])) {
                  await this.register(AutoThridProvider[k]);
                }
              }
            } catch (err) {
              console.warn(`@daze/framework: 自动加载依赖[${depend}]失败，请手动加载`, err);
            }
          }
        }
      }
    }
  }

  /**
   * register Provider
   * @param Provider 
   */
  async register(Provider: Function): Promise<void> {
    await this.get<Provider>('provider').resolve(Provider);
  }

  /**
 * add init providers
 * @param Providers 
 */
  private static addInitProviders(...Providers: (Function | Function[])[]) {
    for (const Provider of Providers) {
      if (Array.isArray(Provider)) {
        this.initProviders.push(...Provider);
      } else {
        this.initProviders.push(Provider);
      }
    }
  }

  /**
   * create Application instance with Providers
   */
  static create(option: ApplicationCreateOption | Function | Function[], ...restProviders: (Function | Function[])[]) {
    if (Reflect.apply(Object.prototype.toString, option, []) === '[object Object]') {
      this.addInitProviders(...restProviders);
      return new Application((option as ApplicationCreateOption).rootPath, (option as ApplicationCreateOption).paths);
    }
    const providers = [
      option as Function | Function[],
      ...restProviders
    ];
    this.addInitProviders(...providers);
    return new Application();
  }

  /**
   * fire launch calls
   * @param args 
   */
  async fireLaunchCalls(...args: any[]): Promise<this> {
    for (const launch of this.launchCalls) {
      await launch(...args, this);
    }
    return this;
  }

  /**
   * getter for Configuration cluster.enabled
   */
  get isCluster() {
    return this.config.get('app.cluster', false);
  }

  // 获取集群主进程实例
  private getClusterMaterInstance() {
    return new Master(this, {
      port: this.port,
      workers: this.config.get('app.workers', 0),
      sticky: this.config.get('app.sticky', false)
    });
  }


  // 获取集群工作进程实例
  private getClusterWorkerInstance() {
    return new Worker({
      port: this.port,
      sticky: this.config.get('app.sticky', false),
      createServer: (...args: any[]) => {
        const server = this.startServer(...args);
        return server;
      },
    });
  }

  /**
   * 自动配置框架运行环境
   */
  private loadEnv() {
    const nodeEnv = process.env.NODE_ENV;
    const dazeEnv = process.env.DAZE_ENV;
    if (!nodeEnv) {
      switch (dazeEnv) {
        case 'dev':
          process.env.NODE_ENV = 'development';
          break;
        case 'test':
          process.env.NODE_ENV = 'test';
          break;
        default:
          process.env.NODE_ENV = 'production';
          break;
      }
    }
    return this;
  }

  /**
   * env getter
   */
  private get env() {
    return process.env.DAZE_ENV || (process.env.NODE_ENV && envMap.get(process.env.NODE_ENV)) || process.env.NODE_ENV;
  }

  /**
   * get env
   */
  getEnv() {
    return this.env;
  }

  /**
   * load default listener
   */
  protected loadListeners() {
    if (!this.listenerCount('error')) {
      this.on('error', this.onerror.bind(this));
    }
  }

  /**
   * app error listener
   * @param err 
   */
  protected onerror(err: ErrorCollection) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));
    // eslint-disable-next-line
    console.error();
    // eslint-disable-next-line
    console.error(err.stack || err.toString());
    // eslint-disable-next-line
    console.error();
  }

  /**
   * register Keygrip keys
   */
  private registerKeys() {
    const keys = this.config.get('app.keys', ['DAZE_KEY_1']);
    const algorithm = this.config.get('app.algorithm', 'sha1');
    const encoding = this.config.get('app.encoding', 'base64');
    this.keys = new Keygrip(keys, algorithm, encoding);
  }

  /**
     * fire agent instance 's resolves
     */
  private async fireAgentResolves() {
    const agents = this.get('loader').getComponentsByType('agent') || [];
    for (const Agent of agents) {
      const agent = new Agent();
      await agent.resolve(this);
    }
    return this;
  }

  /**
     * 注册应用程序需要的服务
     */
  private async registerWorkerProvider(): Promise<void> {
    await this.register(WorkerProvider);
  }


  /**
   * 初始化用于 CLI 的 app 应用
   */
  public async initializeForCli() {
    // 加载环境变量
    this.loadEnv();
    // 设置应用程序
    await this.setupApp();
    // 注册密钥
    this.registerKeys();
    // 注册框架运行必须的服务提供者
    await this.registerCommonProviders();
  }

  /**
   * Initialization application
   */
  async initialize() {
    // 加载运行环境
    this.loadEnv();
    // 加载默认事件监听器
    this.loadListeners();
    // 配置 APP
    await this.setupApp();
    // 注册密钥
    this.registerKeys();
    // 注册框架运行必须的服务提供者
    await this.registerCommonProviders();
   
    // 在集群模式下，主进程不运行业务代码
    if (!this.isCluster || !cluster.isMaster) {
      // 独立工作进程
      if (this.isCluster && process.env.DAZE_PROCESS_TYPE === 'agent') {
        // 注册初始化提供者
        await this.registerInitProviders();
        // 注册 agent 使用的第三方服务提供者
        await this.registerVendorProviders();
        // 注册自动加载的第三方依赖
        await this.registerAutoProviders();
        // 执行所有服务提供者的 launch 钩子
        await this.fireLaunchCalls();
        // 执行独立进程的钩子
        await this.fireAgentResolves();
      }
      //  业务工作进程
      else {
        // 注册 worker 必须的内置服务提供者
        await this.registerWorkerProvider();
        // 注册初始化提供者
        await this.registerInitProviders();
        // 注册 worker 使用的第三方服务提供者
        await this.registerVendorProviders();
        // 注册自动加载的第三方依赖
        await this.registerAutoProviders();
        // 执行所有服务提供者的 launch 钩子
        await this.fireLaunchCalls();
        // 如果是单进程也会运行 agent
        if (!this.isCluster) {
          // 执行独立进程的钩子
          await this.fireAgentResolves();
        }
        // 加载全局中间件
        this.loadGlobalMiddlewares();
      }
    }
    // 集群模式下，主进程需要运行的代码
    else if (this.isCluster && cluster.isMaster) {
      // 注册 master 使用的第三方服务提供者
      await this.registerVendorProviders();
      // 注册自动加载的第三方依赖
      await this.registerAutoProviders();
      // 执行所有服务提供者的 launch 钩子
      await this.fireLaunchCalls();

      // 加载全局中间件
      this.loadGlobalMiddlewares();
    }
  }

  /**
     * 加载全局中间件
     */
  private loadGlobalMiddlewares() {
    if (this.isCluster && this.isMaster) return;
    for (const m of this.middlewares) {
      this.get<MiddlewareService>(MiddlewareService).register(m.middleware, m.args);
    }
  }

  enableHttps(httpsOptions: HttpsOptions) {
    this.isHttps = true;
    this.httpsOptions = httpsOptions;
    return this;
  }

  /**
   * Start the application
   */
  async run(port?: number) {
    // 初始化应用
    await this.initialize();
    // 需要的情况下重新赋值端口号
    if (port) {
      this.port = port;
    } else {
      const configPort = this.config.get('app.port');
      if (configPort) {
        this.port = configPort;
      }
    }
    debug(`准备启动应用程序, 端口号: ${this.port}`);
    // 启动 http 服务
    // 检查 cluster 模式是否开启
    if (this.isCluster) {
      debug(`当前为 cluster模式, 使用 cluster 模式启动应用程序`);
      // 以集群工作方式运行应用
      if (cluster.isMaster) {
        const master = this.getClusterMaterInstance();
        master.forkAgent();
        await master.run();
      } else {
        //  只有工作进程启动服务
        if (process.env.DAZE_PROCESS_TYPE === 'worker') {
          const worker = this.getClusterWorkerInstance();
          this._server = await worker.run();
        }
        return;
      }
    } else {
      debug(`当前为单线程模式, 使用单线程模式启动应用程序`);
      // 以单线程工作方式运行应用
      this._server = this.listen(this.port, () => {
        if (this.listenerCount('ready') > 0) {
          this.emit('ready');
        } else {
          console.log(`服务已启动, 监听端口号为: ${this.port}`);
        }
      });
    }
  }

  /**
   * close server
   */
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._server) return reject(new Error('app does not running!'));
      return this._server.close((error: any) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  /**
   * Start the HTTP service
   */
  protected startServer(...args: any[]) {
    return this.listen(...args);
  }

  /**
   * 监听 http 服务
   * @param args 
   */
  protected listen(...args: any[]) {
    const server: AppServer = this.get('appServer');
    return server.listen(...args);
  }


  /**
   * call function type concrete
   * @param abstract 
   * @param args 
   */
  call(abstract: any, args: any[] = []) {
    const concrete = this.make(abstract);
    if (typeof concrete !== 'function') return undefined;
    return concrete(...args);
  }

  /**
   * Gets the binding dependency from the container
   */
  tagged(tag: string) {
    if (!this.tags[tag]) return [];
    return this.tags[tag];
  }

  /**
   * set abstract in groups
   */
  tag(abstract: any, tag: string) {
    if (!abstract || !tag) return undefined;
    if (!this.tags[tag]) this.tags[tag] = [];
    this.tags[tag].push(abstract);
    return this;
  }

  get(abstract: 'app', args?: any[], force?: boolean): Application
  get(abstract: 'config', args?: any[], force?: boolean): Config
  get(abstract: 'logger', args?: any[], force?: boolean): Logger & winston.Logger
  get(abstract: 'job', args?: any[], force?: boolean): Job
  get(abstract: 'db', args?: any[], force?: boolean): Database
  get(abstract: 'appServer', args?: any[], force?: boolean): AppServer
  get(abstract: 'messenger', args?: any[], force?: boolean): MessengerService
  get<T = any>(abstract: any, args?: any[], force?: boolean): T
  get(abstract: any, args?: any[], force?: boolean): any

  /**
   * Gets the binding dependency from the container
   */
  get(abstract: any, args: any[] = [], force = false) {
    return this.make(abstract, args, force);
  }

  /**
   * Bind dependencies to the container
   */
  bind(abstract: any, concrete: any = null, shared = true, callable = false): any {
    return shared
      ? this.singleton(abstract, concrete, callable)
      : this.multiton(abstract, concrete, callable);
  }

  /**
   * Check that the dependency id is bound to the container
   */
  has(abstract: any) {
    return this.bound(abstract);
  }
}

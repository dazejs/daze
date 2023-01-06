/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import cluster, { Worker as ClusterWorker } from 'cluster';
import Debug from 'debug';
import fs from 'fs';
import { Server } from 'http';
import Keygrip from 'keygrip';
import * as path from 'path';
import mainFilename from 'require-main-filename';
import * as winston from 'winston';
import { Master, Worker } from '../cluster';
import { Config } from '../config';
import { Container } from '../container';
import { MiddlewareService } from '../http/middleware';
import { AppServer } from '../http/server';
import { HttpsOptions } from '../interfaces/external/https-options';
import { Loader } from '../loader';
import { Provider } from '../provider';
import { Database } from '../supports/database';
import { Logger } from '../supports/logger';
import { CommonProvider, WorkerProvider } from './auto-providers';


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
}

const debug = Debug('@dazejs/framework:application');

export class Application extends Container {
  /**
   * The base path for the Application installation.
   */
  public rootPath = '';

  /**
   * The app workspace path
   */
  public appPath = '';

  /**
   * The config file path
   */
  public configPath = '';

  /**
   * The views file path
   */
  public viewPath = '';

  /**
   * The public file path
   */
  public publicPath = '';

  /**
   * 数据存储目录
   */
  public storeagePath = '';
  /**
   * The log file path
   */
  public logPath = '';

  /**
   * keygrip keys
   */
  public keys: any[] = [];

  /**
   * http Server
   */
  private _server?: Server;

  /**
   * The config instance
   */
  private config: Config;

  /**
   * application run port
   */
  public port = 0;

  /**
   * debug enabled?
   */
  public isDebug = false;

  /**
   * needs to parse body
   */
  public needsParseBody = true;

  /**
   * needs session
   */
  public needsSession = true;

  /**
   * global middlewares
   */
  public middlewares: {
    middleware: any,
    args: any[]
  }[] = [];

  /**
   * needs static server
   */
  public needsStaticServer = true;

  /**
   * provider launch calls
   */
  launchCalls: ((...args: any[]) => any)[] = [];

  /**
   * is https
   */
  public isHttps = false;

  /**
   * https Options
   */
  httpsOptions?: HttpsOptions;

  /**
   * cluster agent worker
   */
  private agent?: ClusterWorker;

  /**
   * cluster workers
   */
  private workers?: ClusterWorker[];

  /**
   * Create Application Instance
   * @param rootPath
   * @param paths
   */
  constructor(option?: ApplicationCreateOption) {
    super();
    // 初始化目录结构
    this.initDirectoryStructure(option?.rootPath, option?.paths);
    // 初始化服务容器
    this.initContainer();
    // 初始化配置解析器
    this.initConfig();
    // 初始化服务提供者解析器
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
   * 初始化容器
   *
   * 将应用类作为容器的实例（管理容器）
   */
  private initContainer() {
    Container.setInstance(this);
    this.bind('app', this);
    this.bind(Application, () => this.get('app'), true, true);
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


  private async setupApp(): Promise<this> {
    debug(`准备配置应用程序`);
    this.config = this.get('config');
    await this.config.initialize();
    if (!this.port) this.port = this.config.get('app.port', DEFAULT_PORT);
    if (process.env.NODE_ENV === 'development' || process.env.DAZE_ENV === 'dev') {
      this.isDebug = this.config.get('app.debug', false);
    }
    if (this.isCluster) this.make('messenger');
    debug(`配置应用程序已完成`);
    return this;
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

  /**
   * get cluster agent
   */
  getAgent() {
    return this.agent;
  }

  /**
   * get cluster worker (ex agent)
   */
  getWorkers() {
    return this.workers;
  }

  /**
     * register vendor providers
     * @private
     */
  private async registerVendorProviders(): Promise<void> {
    const _providers = this.config.get('app.providers', []);
    for (const Provider of _providers) {
      if (!this.has(Provider)) {
        await this.register(Provider);
      }
    }
  }


  /**
     * 注册一个服务提供者到应用程序中
     * @param Provider
     */
  public async register(Provider: any): Promise<void> {
    // 必须是 provider 类型
    if (Reflect.getMetadata('type', Provider) !== 'provider') return;
    // provider 由构造函数 initProvider 注册在容器中
    await this.get<Provider>('provider').resolve(Provider);
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
     * 获取配置是否启用了 cluster 模式
     */
  public get isCluster() {
    return this.config.get('app.cluster', false);
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

  // 获取集群主进程实例
  private getClusterMaterInstance() {
    return new Master({
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
        const server = this.listen(...args);
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
     * 注册基础的服务提供者
     *
     * 这些提供者是框架运行必须的内置提供者
     */
  private async registerCommonProviders(): Promise<void> {
    debug(`准备注册框架运行必须的组件`);
    await this.register(CommonProvider);
    debug(`已成功注册框架运行必须的组件`);
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
              console.warn(`@dazejs/framework: 自动加载依赖[${depend}]失败，请手动加载`, err);
            }
          }
        }
      }
    }
  }

  /**
     * 注册应用程序需要的服务
     */
  private async registerWorkerProvider(): Promise<void> {
    await this.register(WorkerProvider);
  }

  /**
     * 加载全局中间件
     * @param Middleware
     */
  public use(Middleware: any, args?: any[]) {
    if (!this.has(Middleware)) {
      this.singleton(Middleware, Middleware);
    }
    this.middlewares.push({
      middleware: Middleware,
      args:args??[]
    });
    return this;
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
     * 初始化应用
     */
  public async initialize() {
    // 加载环境变量
    this.loadEnv();
    // 设置应用程序
    await this.setupApp();
    // 注册密钥
    this.registerKeys();
    // 注册框架运行必须的服务提供者
    await this.registerCommonProviders();

    // 在集群模式下，主进程不运行业务代码
    if (!this.isCluster || !cluster.isMaster) {
      // 独立工作进程
      if (this.isCluster && process.env.TIGER_PROCESS_TYPE === 'agent') {
        debug('当前进程为 Agent 进程，执行 Agent 操作');
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

    return this._server;
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
     * 启动服务监听功能
     * @param args
     */
  private listen(...args: any[]) {
    if (!this.listenerCount('error')) this.handleEarsError();
    const server = this.get<AppServer>('appServer');
    return server.listen(...args);
  }

  /**
     * 监听
     * @returns
     */
  private handleEarsError() {
    if (this.listenerCount('error') > 0) return;
    this.on('error', (err) => {
      console.error(err);
    });
        
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
  get(abstract: 'db', args?: any[], force?: boolean): Database
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

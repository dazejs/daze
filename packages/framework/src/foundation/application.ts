/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as cluster from 'cluster';
import { Server } from 'http';
import Keygrip from 'keygrip';
import * as path from 'path';
import mainFilename from 'require-main-filename';
import * as util from 'util';
import * as winston from 'winston';
import { Master, Worker } from '../cluster';
import { Config } from '../config';
import { Container } from '../container';
import { Database } from '../database';
import { ErrorCollection } from '../errors/handle';
import { Logger } from '../logger';
import { Provider } from '../provider';
import { AppProvider, CommonProvider } from './auto-providers';
import { HttpServer } from './http-server';
import { Agent } from '../base/agent';

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
   * keygrip keys
   */
  keys: any[];

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

  agents: Agent[] = [];

  /**
   * Create Application Instance
   * @param rootPath 
   * @param paths 
   */
  constructor(rootPath?: string, paths: ApplicationPathsOptions = {}) {
    super();

    if (!rootPath) {
      const _filename = mainFilename();
      if (_filename) {
        this.rootPath = path.dirname(_filename);
      } else {
        throw new Error('can not find rootPath in application, may need to pass rootPath in parameters');
      }
    } else {
      this.rootPath = rootPath;
    }
    
    this.setPaths(paths);

    this.initialContainer();

    this.initProvider();
  }

  /**
   *  Set the paths for the application.
   */
  setPaths(paths: ApplicationPathsOptions): this {
    /** app workspace path */
    this.appPath = path.resolve(this.rootPath, paths.app || 'app');
    /** config file path */
    this.configPath = path.resolve(this.rootPath, paths.config || 'config');
    /** views file path */
    this.viewPath = path.resolve(this.rootPath, paths.view || '../views');
    /** public file path */
    this.publicPath = path.resolve(this.rootPath, paths.public || '../public');
    /** log file path */
    this.logPath = path.resolve(this.rootPath, paths.log || '../logs');

    return this;
  }

  async setProperties(): Promise<this> {
    this.config = this.get('config');
    await this.config.initialize();
    if (!this.port) this.port = this.config.get('app.port', DEFAULT_PORT);
    if (process.env.NODE_ENV === 'development' || process.env.DAZE_ENV === 'dev') {
      this.isDebug = this.config.get('app.debug', false);
    }
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
   * register base provider
   */
  async registerBaseProviders(): Promise<void> {
    await this.register(CommonProvider);
  }

  /**
   * register default provider
   * @private
   */
  async registerDefaultProviders(): Promise<void> {
    await this.register(AppProvider);
  }

  /**
   * register vendor providers
   * @private
   */
  async registerVendorProviders(): Promise<void> {
    const _providers = this.config.get('app.providers', []);
    for (const key of _providers) {
      await this.register(key);
    }
  }

  async register(Provider: Function): Promise<void> {
    await this.get<Provider>('provider').resolve(Provider);
  }

  async fireLaunchCalls(...args: any[]): Promise<this> {
    for (const launch of this.launchCalls) {
      await launch(...args, this);
    }
    return this;
  }

  /**
   * initial Container
   */
  initialContainer(): void {
    Container.setInstance(this);
    this.bind('app', this);
  }

  /**
   * initial Provider
   */
  initProvider(): void {
    this.singleton('provider', Provider);
  }

  /**
   * getter for Configuration cluster.enabled
   */
  get isCluster() {
    return this.config.get('app.cluster', false);
  }

  // 获取集群主进程实例
  getClusterMaterInstance() {
    return new Master({
      port: this.port,
      workers: this.config.get('app.workers', 0),
      sticky: this.config.get('app.sticky', false)
    });
  }


  // 获取集群工作进程实例
  getClusterWorkerInstance() {
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
  loadEnv() {
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
  get env() {
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
  loadListeners() {
    if (!this.listenerCount('error')) {
      this.on('error', this.onerror.bind(this));
    }
  }

  /**
   * app error listener
   * @param err 
   */
  onerror(err: ErrorCollection) {
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
  registerKeys() {
    const keys = this.config.get('app.keys', ['DAZE_KEY_1']);
    const algorithm = this.config.get('app.algorithm', 'sha1');
    const encoding = this.config.get('app.encoding', 'base64');
    this.keys = new Keygrip(keys, algorithm, encoding);
  }

  registerAgents() {
    const _agents = this.config.get('app.agents', []);
    for (const _agent of _agents) {
      const agentInstance = new _agent();
      this.agents.push(agentInstance);
    }
    return this;
  }

  async fireAgentResolves() {
    for (const agent of this.agents) {
      await agent.resolve();
    }
    return this;
  }

  /**
   * Initialization application
   */
  async initialize() {
    // 加载运行环境
    this.loadEnv();

    this.loadListeners();

    await this.registerBaseProviders();

    await this.setProperties();

    this.registerKeys();

    // 在集群模式下，主进程不运行业务代码
    if (cluster.isWorker) {
      if (process.env.type === 'worker') { // 业务工作进程
        await this.registerDefaultProviders();
        await this.registerVendorProviders();
        await this.fireLaunchCalls();
      } else if (process.env.type === 'agent') { // 独立工作进程
        this.registerAgents();
        await this.fireAgentResolves();
      }
    }
  }

  /**
   * Start the application
   */
  async run(port?: number) {
    // reload port if necessary
    if (port) this.port = port;
    // Initialization application
    await this.initialize();
    // check app.cluster.enabled
    if (this.isCluster) {
      // 以集群工作方式运行应用
      if (cluster.isMaster) {
        const master = this.getClusterMaterInstance();
        await master.run();
      } else {
        if (process.env.type === 'worker') {
          const worker = this.getClusterWorkerInstance();
          this._server = await worker.run();
        }
      }
    } else {
      // 以单线程工作方式运行应用
      this._server = this.startServer(this.port);
    }
    return this._server;
  }

  /**
   * close server
   */
  close() {
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
  startServer(...args: any[]) {
    return this.listen(...args);
  }

  listen(...args: any[]) {
    const server: HttpServer = this.get('httpServer');
    return server.listen(...args);
  }


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
    // if (!shouldMake) return this.tags[tag];
    // return this.tags[tag].map((abstract: any) => this.make(abstract, args));
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
  get(abstract: 'httpServer', args?: any[], force?: boolean): HttpServer
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

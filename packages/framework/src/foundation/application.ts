/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import path from 'path'
import cluster from 'cluster'
import util from 'util'
import Keygrip from 'keygrip'
import is from 'core-util-is'
import { Server } from 'http'
import { Container } from '../container'
import { Master, Worker } from '../cluster'
import * as providers from './providers'
import { HttpError } from '../errors/http-error'
import { httpServer } from './http-server'
import { Config } from '../config'
import { Logger } from '../logger'

const DEFAULT_PORT = 8080;

export class Application extends Container {
  /**
   * The base path for the Application installation.
   */
  rootPath: string = '';

  /**
   * The app workspace path
   */
  appPath: string = '';

  /**
   * The config file path
   */
  configPath: string = '';

  /**
   * The views file path
   */
  viewPath: string = '';

  /**
   * The public file path
   */
  publicPath: string = '';

  /**
   * The log file path
   */
  logPath: string = '';

  /**
   * keygrip keys
   */
  keys: any[]

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
  port: number = 0;

  /**
   * debug enabled?
   */
  isDebug: boolean = false;

  /**
   * needs to parse body
   */
  needsParseBody: boolean = true;

  /**
   * needs session
   */
  needsSession: boolean = true;

  /**
   * provider launch calls
   */
  launchCalls: ((...args: any[]) => any)[] = [];

  /**
   * provider runtime calls
   */
  runtimeCalls: ((...args: any[]) => any)[] = [];

  /**
   * Create a Dazejs Application insstance
   */
  constructor(rootPath: string, paths: any = {}) {
    super();
    if (!rootPath) throw new Error('must pass the runPath parameter when you apply the instantiation!');

    this.rootPath = rootPath;

    this.setPaths(paths);

    this.initialContainer();
  }

  /**
   *  Set the paths for the application.
   */
  setPaths<T extends {[key: string]: any}>(paths: T): this {
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
    await this.config.initialize()
    this.port = this.config.get('app.port', DEFAULT_PORT);
    this.isDebug = this.config.get('app.debug', false);

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
   * register base provider
   */
  async registerBaseProviders(): Promise<void> {
    await this.register(new providers.ConfigProvider(this));
    await this.register(new providers.LoaderProvider(this));
    await this.register(new providers.MessengerProvider(this));
  }

  /**
   * register default provider
   * @private
   */
  async registerDefaultProviders(): Promise<void> {
    await this.register(new providers.AppProvider(this));
    await this.register(new providers.ControllerProvider(this));
    // await this.register(new providers.Component(this));
    await this.register(new providers.MiddlewareProvider(this));
    await this.register(new providers.RouterProvider(this));
    await this.register(new providers.TemplateProvider(this));
  }

  /**
   * register vendor providers
   * @private
   */
  async registerVendorProviders(): Promise<void> {
    const _providers = this.config.get('app.providers', []);
    const providerPromises = [];
    for (const key of _providers) {
      providerPromises.push(this.load(key));
    }
    await Promise.all(providerPromises);
  }


  /**
   * load a registed provider with key or provider function
   */
  async load(Provider: any): Promise<this> {
    if (is.isString(Provider)) {
      if (this.has(Provider)) {
        await this.register(this.get(Provider));
        return this;
      }
      try {
        const Target = (await import(Provider)).default;
        await this.register(new Target(this));
      } catch (err) {
        throw new Error(`Can not find provider [${Provider}]!`);
      }
      return this;
    }
    if (is.isFunction(Provider)) {
      const type = Reflect.getMetadata('type', Provider.prototype);
      if (type !== 'provider') throw new Error(`${Provider.name || 'Unknow'} is not a provider!`);
      await this.register(new Provider(this));
      return this;
    }
    throw new Error(`Does not supported ${typeof Provider} Provider!`);
  }

  /**
   * register provider in App
   */
  async register(Provider: any): Promise<void> {
    if (Reflect.has(Provider, 'register') && typeof Provider.register === 'function') {
      await Provider.register(this);
    }

    if (Reflect.has(Provider, 'launch') && typeof Provider.launch === 'function') {
      this.launchCalls.push((...args) => Provider.launch(...args));
    }
  }

  async fireLaunchCalls(...args: any[]): Promise<void> {
    const results = [];
    for (const launch of this.launchCalls) {
      results.push(launch(...args, this));
    }
    await Promise.all(results);
  }

  /**
   * initial Container
   */
  initialContainer(): void {
    Container.setInstance(this);
    this.bind('app', this);
  }

  /**
   * getter for Configuration cluster.enabled
   */
  get isCluster() {
    return this.config.get('app.cluster.enable', false);
  }

  // 获取集群主进程实例
  get clusterMaterInstance() {
    const clusterConfig = this.config.get('app.cluster', {});
    return new Master({
      port: this.port,
      workers: clusterConfig.workers || 0,
      sticky: clusterConfig.sticky || false,
    });
  }


  // 获取集群工作进程实例
  get clusterWorkerInstance() {
    const clusterConfig = this.config.get('app.cluster', {});
    return new Worker({
      port: this.port,
      sticky: clusterConfig.sticky || false,
      createServer: (port: number) => {
        this._server = this.startServer(port)
        return this._server
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
   * load default listener
   */
  loadListeners() {
    if (!this.listenerCount('error')) {
      this.on('error', this.onerror);
    }
  }

  /**
   * app error listener
   * @param err 
   */
  onerror(err: any) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));
    if (err instanceof HttpError) return;
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

    const clusterConfig = this.config.get('app.cluster', {});
    // 在集群模式下，主进程不运行业务代码
    if (!clusterConfig.enable || !cluster.isMaster) {
      await this.registerDefaultProviders();
      await this.registerVendorProviders();
      await this.registerHttpServerProvider();
      await this.fireLaunchCalls();
    }
  }

  async registerHttpServerProvider() {
    await this.register(new providers.HttpServerProvider(this));
  }

  /**
   * Start the application
   */
  async run() {
    // Initialization application
    await this.initialize();
    // check app.cluster.enabled
    if (this.config.get('app.cluster.enable', false)) {
      // 以集群工作方式运行应用
      if (cluster.isMaster) {
        await this.clusterMaterInstance.run();
      } else {
        await this.clusterWorkerInstance.run();
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
  startServer(port?: number) {
    return this.listen(port);
  }

  listen(port?: number) {
    const server: httpServer = this.get('httpServer');
    return server.listen(port);
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
    // return this.tags[tag].map(t => this.make(t, args));
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
  get(abstract: 'logger', args?: any[], force?: boolean): Logger
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

  /**
   * bind and get file path
   */
  craft(abstract: any, shared = true) {
    if (typeof abstract === 'string') {
      if (require.resolve(abstract)) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const Res = require(abstract);
        if (!this.has(Res)) {
          this.bind(Res, Res, shared);
        }
        return this.get(Res);
      }
    } else {
      if (!this.has(abstract)) {
        this.bind(abstract, abstract, shared);
      }
      return this.get(abstract);
    }
    return undefined;
  }
}

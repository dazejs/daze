/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as path from 'path';
import * as winston from 'winston';
import { MongoDB } from 'winston-mongodb';
import { Application } from '../foundation/application';
import { IllegalArgumentError } from '../errors/illegal-argument-error';

const defaultChannels: any = {
  console: {
    driver: 'console'
  }
};

export class Logger {
  /**
   * @var {Application} daze Application instance
   */
  private app: Application;

  /**
   * @var {Container} container winston container instance
   */
  private container: winston.Container = new winston.Container();

  /**
   * winston Logger instance
   */
  private logger: winston.Logger;

  /**
   * @var {Map} defaultDrivers
   * default transports supported
   */
  private defaultDrivers: Map<string ,any> = new Map([
    ['console', winston.transports.Console],
    ['file', winston.transports.File],
    ['http', winston.transports.Http],
    ['stream', winston.transports.Stream],
    ['mongodb', MongoDB],
    ['dailyFile', require('winston-daily-rotate-file')],
  ]);

  /**
    * @var {Map} customDrivers
    * custom transports supported
    */
  private customDrivers: Map<string, any> = new Map();

  /**
   * default Formater
   */
  private defaultFormat: Function = (format: any) => format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.splat(),
    format.printf((info: any) => `[${info.timestamp}] [${info.level.toUpperCase()}] - ${info.message}`),
  );
  [key: string]: any

  /**
   * Create Logger instance
   * @param app 
   */
  constructor(app: Application) {
    this.app = app;
    return new Proxy(this, this.proxy());
  }

  /**
   * class proxy
   */
  private proxy(): ProxyHandler<this> {
    return {
      get(t, prop, reveicer) {
        if (Reflect.has(t, prop) || typeof prop !== 'string') {
          return Reflect.get(t, prop, reveicer);
        }
        return t.logger[prop as keyof winston.Logger];
      },
    };
  }

  /**
   * get winston logger
   */
  public getLogger() {
    return this.logger;
  }

  /**
   * get winston container
   */
  public getContainer() {
    return this.container;
  }

  /**
   * resolve default channel
   */
  private resolveDefaultChannel() {
    const defaultChannelName = this.getDefaultChannelName();
    this.resolve(defaultChannelName);
  }

  /**
   * check the default driver is supported
   */
  public isDefaultDriverSupported(defaultDriverName: string) {
    return this.defaultDrivers.has(defaultDriverName);
  }

  /**
   * check the custom driver is supported
   */
  public isCustomDriverSupported(customDriverName: string) {
    return this.customDrivers.has(customDriverName);
  }

  /**
   * change log channel
   */
  public channel(channelName?: string) {
    if (channelName) this.resolve(channelName);
    else this.resolveDefaultChannel();

    return this;
  }

  /**
   * resolve channel with container
   */
  private resolve(channelName: string) {
    if (!this.container.has(channelName)) {
      const formatCall = this.getFormat(channelName);
      this.container.add(channelName, {
        transports: this.getTransports(channelName),
        format: formatCall(winston.format),
        levels: this.getLevels(),
        level: this.getLevel(),
      });
    }
    this.logger = this.container.get(channelName);
  }

  /**
   * get winston transports
   */
  public getTransports(channelName: string): any[] {
    const config = this.getChannelConfigure(channelName);
    if (!config) throw new IllegalArgumentError(`Logger channel [${channelName}] is not defined.`);
    const { driver: driverName } = config;

    if (this.isComposeChannel(config)) {
      return this.composeDriverCreator(config);
    }

    if (this.isCustomDriverSupported(driverName)) {
      return this.callCustomDriverCreator(config);
    }

    if (this.isDefaultDriverSupported(driverName)) {
      switch (driverName) {
        case 'file':
          return this.defaultDriverCreator({
            ...config,
            filename: path.resolve(this.app.appPath, '../../logs', config.filename)
          });
        default:
          return this.defaultDriverCreator(config);
      }
      // return this[`${driverName}DriverCreator`](config);
    }

    throw new IllegalArgumentError(`Logger Driver [${driverName}] is not supported.`);
  }

  /**
   * get format 
   * @param channelName 
   */
  private getFormat(channelName: string) {
    const topFormat = this.app.get('config').get('logger.format');
    const channelFormat = this.app.get('config').get(`logger.channels.${channelName}.format`);
    return channelFormat || topFormat || this.defaultFormat;
  }

  private getLevels() {
    return this.app.get('config').get('logger.levels');
  }

  private getLevel() {
    return this.app.get('config').get('logger.level', 'info');
  }

  /**
   * get channel configure
   * @private
   */
  private getChannelConfigure<T extends { driver: string;[key: string]: any }>(channelName: string): T {
    const config = this.app.get('config').get(`logger.channels.${channelName}`);
    if (!config) return defaultChannels[channelName];
    return config;
  }

  /**
   * get the default channel name
   */
  private getDefaultChannelName() {
    return this.app.get('config').get('logger.default', 'console');
  }

  /**
   * check the channel is compose
   */
  private isComposeChannel(channel: any) {
    const { driver } = channel;
    return driver === 'compose';
  }

  /**
   * call Custom Driver Creator
   * @param config 
   */
  private callCustomDriverCreator(config: Record<string, any>) {
    const { driver, ...restOpts } = config;
    const [DriverInstance, defaultOptions] = this.customDrivers.get(driver);
    return [new DriverInstance({
      ...defaultOptions,
      ...restOpts
    })];
  }

  /**
   * add a custom driver
   * @param channelName 
   * @param Driver 
   * @param defaultOptions 
   */
  public addCustomDriver(channelName: string, Driver: any, defaultOptions: Record<string, any> = {}) {
    this.customDrivers.set(channelName, [Driver, defaultOptions]);
    return this;
  }

  /**
   * compose driver creator
   */
  private composeDriverCreator(channel: any): any[] {
    const { channels } = channel;
    if (!this.isComposeChannel(channel)) return [];
    let res: any[] = [];
    for (const _channel of channels) {
      const transports = this.getTransports(_channel);
      res = res.concat(transports);
    }
    return res;
  }

  // /**
  //  * console driver creator
  //  */
  // consoleDriverCreator(options: any) {
  //   const { driver, ...restOpts } = options;
  //   return [new winston.transports.Console(restOpts)];
  // }

  private defaultDriverCreator(options: Record<string, any>) {
    const { driver, ...restOpts } = options;
    const DriverInstance = this.defaultDrivers.get(driver);
    return [new DriverInstance(restOpts)];
  }

  // /**
  //  * dailyFile driver creator
  //  */
  // dailyFileDriverCreator(options: any) {
  //   const { driver, ...restOpts } = options;
  //   return [new (require('winston-daily-rotate-file'))(restOpts)];
  // }

  /**
   * file driver creator
   */
  // fileDriverCreator(options: any) {
  //   const { driver, filename, ...restOpts } = options;
  //   const _filename = path.resolve(this.app.appPath, '../../logs', filename);
  //   return [new winston.transports.File({
  //     filename: _filename,
  //     ...restOpts,
  //   })];
  // }

  /**
   * http driver creator
   */
  // httpDriverCreator(options: any) {
  //   const { driver, ...restOpts } = options;
  //   return [new winston.transports.Http(restOpts)];
  // }

  /**
   * stream driver creator
   */
  // streamDriverCreator(options: any) {
  //   const { driver, ...restOpts } = options;
  //   return [new winston.transports.Stream(restOpts)];
  // }

  /**
   * mongodb driver creator
   */
  // mongodbDriverCreator(options: any) {
  //   const { driver, ...restOpts } = options;
  //   return [new MongoDB(restOpts)];
  // }
}

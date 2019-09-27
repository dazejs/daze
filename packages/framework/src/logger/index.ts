/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import path from 'path'
import * as winston from 'winston';
import { MongoDB } from 'winston-mongodb'
// import DailyRotateFile from 'winston-daily-rotate-file';
import { Container } from '../container'
import { IllegalArgumentError } from '../errors/illegal-argument-error'

class LoggerBase {
  app: any;
  container: any;
  logger: any;
  defaultDrivers: any;
  customDrivers: any;
  defaultFormat: any;
  [key: string]: any
  constructor() {
    /**
     * @var {Application} daze Application instance
     */
    this.app = Container.get('app');

    /**
     * @var {Container} container winston container instance
     */
    this.container = new winston.Container();

    /**
      * @var {Logger} logger log instance
      */
    this.logger = null;

    /**
     * @var {Map} defaultDrivers
     * default transports supported
     */
    this.defaultDrivers = new Set(['console', 'file', 'http', 'stream', 'mongodb', 'dailyFile']);

    /**
      * @var {Map} customDrivers
      * custom transports supported
      */
    this.customDrivers = new Map();

    this.defaultFormat = (format: any) => format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.splat(),
      format.printf((info: any) => `[${info.timestamp}] [${info.level.toUpperCase()}] - ${info.message}`),
    );
  }

  /**
   * resolve default channel
   */
  resolveDefaultChannel() {
    const defaultChannelName = this.getDefaultChannelName();
    this.resolve(defaultChannelName);
  }

  /**
   * check the default driver is supported
   */
  isDefaultDriverSupported(defaultDriverName: string) {
    return this.defaultDrivers.has(defaultDriverName);
  }

  /**
   * check the custom driver is supported
   */
  isCustomDriverSupported(customDriverName: string) {
    return this.customDrivers.has(customDriverName);
  }

  /**
   * change log channel
   */
  channel(channelName: string) {
    this.resolve(channelName);
    return this;
  }

  /**
   * resolve channel with container
   */
  resolve(channelName: string) {
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
  getTransports(channelName: string) {
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
      return this[`${driverName}DriverCreator`](config);
    }

    throw new IllegalArgumentError(`Logger Driver [${driverName}] is not supported.`);
  }

  getFormat(channelName: string) {
    const topFormat = this.app.get('config').get('logger.format');
    const channelFormat = this.app.get('config').get(`logger.channels.${channelName}.format`);
    return channelFormat || topFormat || this.defaultFormat;
  }

  getLevels() {
    return this.app.get('config').get('logger.levels');
  }

  getLevel() {
    return this.app.get('config').get('logger.level', 'info');
  }

  /**
   * get channel configure
   * @private
   */
  getChannelConfigure<T extends { driver: string, [key: string]: any }>(channelName: string): T {
    return this.app.get('config').get(`logger.channels.${channelName}`);
  }

  /**
   * get the default channel name
   */
  getDefaultChannelName() {
    return this.app.get('config').get('logger.default', 'console');
  }

  /**
   * check the channel is compose
   */
  isComposeChannel(channel: any) {
    const { driver } = channel;
    return driver === 'compose';
  }

  callCustomDriverCreator(..._args: any[]) {
    // TODO
  }

  /**
   * compose driver creator
   */
  composeDriverCreator(channel: any) {
    const { channels } = channel;
    if (!this.isComposeChannel(channel)) return undefined;
    let res: any[] = [];
    for (const _channel of channels) {
      const transports = this.getTransports(_channel);
      res = res.concat(transports);
    }
    return res;
  }

  /**
   * console driver creator
   */
  consoleDriverCreator(options: any) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.Console(restOpts)];
  }

  /**
   * dailyFile driver creator
   */
  // @ts-ignore
  dailyFileDriverCreator(options: any) {
    const { driver, ...restOpts } = options;
    return [new (require('winston-daily-rotate-file'))(restOpts)];
  }

  /**
   * file driver creator
   */
  fileDriverCreator(options: any) {
    const { driver, filename, ...restOpts } = options;
    const _filename = path.resolve(this.app.appPath, '../../logs', filename);
    return [new winston.transports.File({
      filename: _filename,
      ...restOpts,
    })];
  }

  /**
   * http driver creator
   */
  httpDriverCreator(options: any) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.Http(restOpts)];
  }

  /**
   * stream driver creator
   */
  streamDriverCreator(options: any) {
    const { driver, ...restOpts } = options;
    return [new winston.transports.Stream(restOpts)];
  }

  /**
   * mongodb driver creator
   */
  mongodbDriverCreator(options: any) {
    const { driver, ...restOpts } = options;
    return [new MongoDB(restOpts)];
  }
}

export const Logger = new Proxy(LoggerBase, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended);
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop];
        }
        return t.logger[prop];
      },
    });
  },
});

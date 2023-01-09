import * as path from 'path';
import winston from 'winston';
import { Application } from '../../foundation/application';
import { IllegalArgumentError } from '../../errors/illegal-argument-error';
import { ClusterTransport } from './cluster';

export class Logger {
  /**
     * @var {Application} daze Application instance
     */
  protected app: Application;

  public loggerName = 'default';

  public static Cluster = ClusterTransport;

  /**
     * @var {Container} container winston container instance
     */
  protected container: winston.Container = new winston.Container();

  /**
     * winston Logger instance
     */
  // private logger: winston.Logger;

  /**
     * @var {Object} defaultChannels
     */
  protected defaultChannels: any = {
    console: {
      driver: 'console'
    }
  };

  /**
     * 默认通道
     */
  protected defaultChannelName = 'console';

  /**
     * @var {Map} defaultDrivers
     * default transports supported
     */
  protected defaultDrivers: Map<string ,any> = new Map([
    ['console', winston.transports.Console],
    ['file', winston.transports.File],
    ['http', winston.transports.Http],
    ['stream', winston.transports.Stream],
    ['dailyFile', require('winston-daily-rotate-file')],
  ]);

  /**
    * @var {Map} customDrivers
    * custom transports supported
    */
  protected customDrivers: Map<string, [any, any]> = new Map();

  /**
     * default Formater
     */
  protected defaultFormat = (format: any): any => format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.splat(),
    format.printf((info: any) => `[${info.timestamp}] [${info.level.toUpperCase()}] - ${info.message}`),
  );

  /**
     * Create Logger instance
     * @param app
     */
  constructor(app: Application) {
    this.app = app;
  }

  /**
     * 输出日志
     * @param level 
     * @param message 
     * @param meta 
     * @returns 
     */
  public log(level: string, message: string, ...meta: any[]) {
    return this.channel().log(level, message, ...meta);
  }

  /**
     * 输出错误日志
     * @param message 
     * @param meta 
     * @returns 
     */
  public error (message: string, ...meta: any[]) {
    return this.channel().error(message, ...meta);
  }

  /**
     * 输出警告日志
     * @param message 
     * @param meta 
     * @returns 
     */
  public warn (message: string, ...meta: any[]) {
    return this.channel().warn(message, ...meta);
  }

  /**
     * 输出基本日志
     * @param message 
     * @param meta 
     * @returns 
     */
  public info (message: string, ...meta: any[]) {
    return this.channel().info(message, ...meta);
  }

  /**
     * 输出调试日志
     * @param message 
     * @param meta 
     * @returns 
     */
  public debug (message: string, ...meta: any[]) {
    return this.channel().debug(message, ...meta);
  }

  /**
     * 添加通道
     * @param channelName
     * @param channelConfig
     */
  public addChannel(channelName: string, channelConfig: Record<string, any>) {
    if (this.defaultChannels[channelName]) return;
    this.defaultChannels[channelName] = channelConfig;
  }

  /**
     * get winston logger
     */
  public getLogger() {
    return this.channel();
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
  protected resolveDefaultChannel() {
    const defaultChannelName = this.getDefaultChannelName();
    return this.resolve(defaultChannelName);
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
    if (channelName) return this.resolve(channelName);
    else return this.resolveDefaultChannel();
  }

  /**
     * resolve channel with container
     */
  protected resolve(channelName: string) {
    if (!this.container.has(channelName)) {
      const formatCall = this.getFormat(channelName);
      this.container.add(channelName, {
        transports: this.getTransports(channelName),
        format: formatCall(winston.format),
        levels: this.getLevels(),
        level: this.getLevel(),
      });
    }
    return this.container.get(channelName);
  }

  /**
     * get winston transports
     */
  public getTransports(channelName: string): any[] {
    const _config = this.getChannelConfigure(channelName);
    // format 参数已经使用过了，这里就不需要再使用了
    _config?.format && delete _config.format;
    if (!_config) throw new IllegalArgumentError(`Logger channel [${channelName}] is not defined.`);
    const { driver: driverName, ...restOpts } = _config;

    // cluster 模式下只发送 IPC 消息到 agent 进程
    // 当前进程如果是工作进程，那么就直接使用 cluster ipc 通信的转换器
    if (this.app.isCluster && this.app.isWorker) {
      return [new Logger.Cluster(this.loggerName, channelName, this.app, restOpts)];
    }

    if (this.isComposeChannel(_config)) {
      return this.composeDriverCreator(_config);
    }

    if (this.isCustomDriverSupported(driverName)) {
      return this.callCustomDriverCreator(_config);
    }

    if (this.isDefaultDriverSupported(driverName)) {
      switch (driverName) {
        case 'file':
          return this.defaultDriverCreator({
            ..._config,
            filename: path.resolve(this.app.appPath, '../../logs', _config.filename || 'app.log'),
          });
        case 'dailyFile':
          return this.defaultDriverCreator({
            ..._config,
            filename: path.resolve(this.app.appPath, '../../logs', _config.filename || '%DATE%.log'),
          });
        default:
          return this.defaultDriverCreator(_config);
      }
    }

    throw new IllegalArgumentError(`Logger Driver [${driverName}] is not supported.`);
  }

  /**
     * get format
     * @param channelName
     */
  protected getFormat(channelName: string) {
    const topFormat = this.app.get('config').get('logger.format');
    const channelFormat = this.app.get('config').get(`logger.channels.${channelName}.format`);
    const defaultChanellFormat  = this.defaultChannels[channelName]?.format;
    return channelFormat || topFormat || defaultChanellFormat || this.defaultFormat;
  }

  protected getLevels() {
    return this.app.get('config').get('logger.levels');
  }

  private getLevel() {
    return this.app.get('config').get('logger.level', 'info');
  }

  /**
     * get channel configure
     * @private
     */
  protected getChannelConfigure<T extends { driver: string;[key: string]: any }>(channelName: string): T {
    const cc = this.app.get('config').get(`logger.channels.${channelName}`, {});
    const dc = this.defaultChannels[channelName] ?? {};
    return { ...dc, ...cc };
  }

  /**
     * get the default channel name
     */
  public getDefaultChannelName() {
    return this.app.get('config').get('logger.default', this.defaultChannelName);
  }

  /**
     * check the channel is compose
     */
  protected isComposeChannel(channel: any) {
    const { driver } = channel;
    return driver === 'compose';
  }

  /**
     * call Custom Driver Creator
     * @param config
     */
  protected  callCustomDriverCreator(config: Record<string, any>) {
    const { driver: driverName, ...restOpts } = config;
    const [DriverInstance, defaultOptions] = this.customDrivers.get(driverName) ?? [];
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
  protected composeDriverCreator(channel: any): any[] {
    const { channels } = channel;
    if (!this.isComposeChannel(channel)) return [];
    let res: any[] = [];
    for (const _channel of channels) {
      const transports = this.getTransports(_channel);
      res = res.concat(transports);
    }
    return res;
  }

  protected defaultDriverCreator(options: Record<string, any>) {
    const { driver: driverName, ...restOpts } = options;
    const DriverInstance = this.defaultDrivers.get(driverName);
    return [new DriverInstance(restOpts)];
  }
}
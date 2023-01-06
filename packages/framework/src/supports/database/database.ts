import { IllegalArgumentError } from '../../errors/illegal-argument-error';
import { Application } from '../../foundation/application';
import { Manager, MysqlManager } from './manager';
import { MysqlConnector } from './connector/mysql-connector';

export class Database {
  /**
   * Application instance
   */
  app: Application;

  /**
   * The active connection instances.
   */
  managers: Map<string, Manager> = new Map();

  /**
   * Create Database instance
   */
  constructor(app: Application) {

    this.app = app;

    return new Proxy(this, this.proxy);
  }

  /**
   * instance proxy
   */
  get proxy(): ProxyHandler<this> {
    return {
      get(target: Database, p: string | number | symbol, receiver: any) {
        if (typeof p === 'string') {
          if (Reflect.has(target, p)) {
            return Reflect.get(target, p, receiver);
          }
          return target.connection()[p as keyof Manager];
        }
        return Reflect.get(target, p, receiver);
      }
    };
  }

  /**
   * close connection by name
   * @param name 
   */
  close(name = 'default') {
    if (this.managers.has(name)) {
      this.managers.get(name)?.close();
    }
  }

  /**
   * Auto connection 
   * @param name 
   */
  connection<T extends Manager>(name = 'default'): T {
    if (!this.managers.has(name)) {
      const config = this.getConnectioncConfigure(name);
      this.managers.set(name, this.createConnection(config));
    }
    return this.managers.get(name) as T;
  }

  /**
   * Create Connection instance for each type
   * @param config database connection options
   */
  createConnection(config: any) {
    const { type, ...restConfig } = config
    switch (type) {
      case 'mysql':
        const pool = (new MysqlConnector()).connect(restConfig);
        return new MysqlManager(pool);
    }
    throw new IllegalArgumentError(`Unsupported database type [${config.type}]`);
  }

  /**
   * Get Connection Options 
   * @param name connection name
   */
  getConnectioncConfigure(name: string) {
    return this.app.get('config').get(`database.${name}`);
  }
}
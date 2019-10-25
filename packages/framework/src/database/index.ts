import { Application } from '../foundation/application'
import { IllegalArgumentError } from '../errors/illegal-argument-error'
import { MysqlConnection } from './connection/mysql-connection'
import { ConnectionInterface } from './connection/connection.interface'
import { Container } from '../container'
import { MysqlConnector } from './connector/mysql-connector'

interface IConnections {
  [key: string]: ConnectionInterface
}

export class Database {
  /**
   * Application instance
   */
  app: Application = Container.get('app');

  /**
   * The active connection instances.
   */
  connections: IConnections = {};

  /**
   * Create Database instance
   */
  constructor() {
    return new Proxy(this, this.proxy);
  }

  /**
   * instance proxy
   */
  get proxy() {
    return {
      get(target: any, p: string | number | symbol, receiver: any) {
        if (typeof p === 'string') {
          if (Reflect.has(target, p)) {
            return Reflect.get(target, p, receiver)
          }
          return target.connection()[p]
        }
        return Reflect.get(target, p, receiver)
      }
    }
  }

  connection(name: string = 'default') {
    if (!this.connections[name]) {
      const config = this.getConnectioncConfigure(name)
      this.connections[name] = this.createConnection(config)
    }
    return this.connections[name]
  }

  /**
   * Create Connection instance for each type
   * @param config database connection options
   */
  createConnection(config: any) {
    switch (config.type) {
      case 'mysql':
        const connection = (new MysqlConnector()).connect(config);
        return new MysqlConnection(connection);
    }
    throw new IllegalArgumentError(`Unsupported daqtabase type [${config.type}]`);
  }

  /**
   * Get Connection Options 
   * @param name connection name
   */
  getConnectioncConfigure(name: string) {
    const namedConfig = this.app.get('config').get(`database.${name}`)
    const defaultConfig = this.app.get('config').get('database.default')
    return namedConfig || defaultConfig
  }
}
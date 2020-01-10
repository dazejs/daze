import { Pool, PoolConnection } from 'mysql';
import { MysqlParser } from '../parser';
import { Manager } from './manager';
import { MysqlActuator, MysqlTransactionActuator } from '../actuator';
import { Builder } from '../builder';

export class MysqlManager extends Manager {
  /**
   * Mysql connection
   */
  pool: Pool;

  /**
   * Create Mysql Connection instance
   * @param pool 
   */
  constructor(pool: Pool) {
    super();
    this.pool = pool;
    this.actuator = this.getDefaultActuator();
    this.parser = this.getDefaultParser();
  }

  /**
   * close connection
   */
  close() {
    this.pool.end();
  }

  /**
   * default parser for mysql
   */
  getDefaultParser() {
    return new MysqlParser();
  }

  /**
   * default Actuator fro mysql
   */
  getDefaultActuator() {
    return new MysqlActuator(this.pool);
  }

  /**
   * Actuator use pool connection
   * @param connection
   */
  getTransactionActuator(connection: PoolConnection) {
    return new MysqlTransactionActuator(connection);
  }

  /**
   * set builder from and return builder
   * @param table 
   * @param as 
   */
  table(table: string, as?: string): Builder {
    return (new Builder(this.actuator, this.parser)).table(table, as);
  }

  /**
   * begin Transaction
   */
  beginTransaction(): Promise<Builder> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) return reject(err);
        const actuator = this.getTransactionActuator(connection);
        const builder = new Builder(actuator, this.parser);
        connection.beginTransaction((error) => {
          if (error) return reject(error);
          resolve(builder);
        });
      });
    });
  }

  /**
   * auto transaction
   * @param callback 
   */
  async transaction(callback: (conn: Builder) => Promise<void> | void) {
    const conn = await this.beginTransaction();
    try {
      await callback(conn);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  }
}
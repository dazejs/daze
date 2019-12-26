import { Connection, Pool } from 'mysql';
import { MysqlParser } from '../parser';
import { AbstractConnection } from './connection.abstract';


export class MysqlConnection extends AbstractConnection {
  /**
   * Mysql connection
   */
  connection: Connection | Pool;

  /**
   * Create Mysql Connection instance
   * @param connection 
   */
  constructor(connection: Connection | Pool) {
    super();
    this.connection = connection;
  }

  /**
   * close connection
   */
  close() {
    this.connection.end();
  }

  /**
   * default parser for mysql
   */
  getDefaultParser() {
    return new MysqlParser();
  }

  /**
   * Run a select statement against the database.
   * @param query
   * @param bindings
   */
  async select(query: string, bindings: any[] = []): Promise<any[]> {
    return this.query(query, bindings);
  }

  /**
   * Run an insert statement against the database.
   * @param query
   * @param bindings
   */
  async insert(query: string, bindings: any[] = []): Promise<number> {
    return this.query(query, bindings).then((result: any) => result.insertId);
  }

  /**
   * Run an update statement against the database.
   * @param query
   * @param bindings
   */
  async update(query: string, bindings: any[] = []): Promise<number> {
    return this.query(query, bindings).then((result: any) => result.affectedRows);
  }

  /**
   * Run a delete statement against the database.
   * @param query
   * @param bindings
   */
  async delete(query: string, bindings: any[] = []): Promise<number> {
    return this.query(query, bindings).then((result: any) => result.affectedRows);
  }

  /**
   * Execute an SQL statement and return the origin result
   * @param query
   * @param bindings
   */
  query(query: string, bindings: any[] = []): any {
    return new Promise((resolve, reject) => {
      this.connection.query(query, bindings, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }
}
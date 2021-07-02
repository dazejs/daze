import { PoolConnection } from 'mysql2';
import { Actuator } from './actuator';

export class MysqlTransactionActuator extends Actuator {
  /**
   * mysql 连接池连接对象
   */
  connection: PoolConnection;

  /**
   * Create Mysql Actuator
   * @param connection 
   */
  constructor(connection: PoolConnection) {
    super();
    this.connection = connection;
  }

  /**
    * Execute an SQL statement and return the origin result
    * @param query
    * @param bindings
    */
  query(query: string, bindings: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, bindings, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
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
   * commit transaction
   */
  commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.commit((err) => {
        if (err) return reject(err);
        this.connection.release();
        return resolve();
      });
    });
  }

  /**
   * rollback transaction
   */
  rollback(): Promise<void> {
    return new Promise((resolve) => {
      this.connection.rollback(() => {
        this.connection.release();
        return resolve();
      });
    });
  }
}
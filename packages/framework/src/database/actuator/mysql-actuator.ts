import { Pool } from 'mysql';
import { Actuator } from './actuator';

export class MysqlActuator extends Actuator {
  /**
   * Mysql Pool instance
   */
  pool: Pool;

  /**
   * Create mysql pool actuator
   * @param pool 
   */
  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  /**
    * Execute an SQL statement and return the origin result
    * @param query
    * @param bindings
    */
  query(query: string, bindings: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, bindings, (err, results) => {
        if (err) return reject(err);
        resolve(results);
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
  async commit() {
    throw new Error('You must open the transaction before you can use it');
  }

  /**
   * rollback transaction
   */
  async rollback() {
    throw new Error('You must open the transaction before you can use it');
  }
}
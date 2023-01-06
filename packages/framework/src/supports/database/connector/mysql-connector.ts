import { PoolOptions, createPool } from 'mysql2';
import { Connector } from './connector';

export class MysqlConnector extends Connector {
  /**
   * connect to mysql use pool
   * @param options 
   */
  connect(options: PoolOptions) {
    const pool = createPool(options);
    return pool;
  }

  // /**
  //  * connect to mysql
  //  */
  // connect(options: string | ConnectionConfig) {
  //   const connection = createConnection(options);
  //   connection.connect();
  //   connection.on('error', (err: MysqlError) => {
  //     this.handleConnectionLost(err, options);
  //   });
  //   return connection;
  // }

  // /**
  //  * handle error when connection lost
  //  * @param err 
  //  * @param options 
  //  */
  // handleConnectionLost(err: MysqlError, options: string | ConnectionConfig) {
  //   if (err) {
  //     if (err.fatal) {
  //       this.connect(options);
  //     } else {
  //       throw err;
  //     }
  //   }
  // }
}
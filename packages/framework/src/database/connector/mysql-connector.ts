import { Connection, ConnectionConfig, createConnection, MysqlError } from 'mysql';
import { ConnectorInterface } from './connector.interface';

/**
 * Mysql 连接器
 * 默认连接 8 小时断开，支持断开后重连
 */
export class MysqlConnector implements ConnectorInterface {
  /**
   * mysql connection
   */
  connection: Connection;

  /**
   * connect to mysql
   */
  connect(options: string | ConnectionConfig) {
    const connection = createConnection(options);
    connection.connect();
    connection.on('error', (err: MysqlError) => {
      this.handleConnectionLost(err, options);
    });
    return connection;
  }

  /**
   * handle error when connection lost
   * @param err 
   * @param options 
   */
  handleConnectionLost(err: MysqlError, options: string | ConnectionConfig) {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        this.connect(options);
      } else {
        throw err;
      }
    }
  }
}
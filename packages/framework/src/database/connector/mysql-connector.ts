import { Connection, ConnectionConfig, createConnection, MysqlError } from 'mysql';

import { ConnectorInterface } from './connector.interface';

// Mysql 连接器
export class MysqlConnector implements ConnectorInterface {

  connection: Connection;

  connect(options: string | ConnectionConfig) {
    const connection = createConnection(options);
    connection.connect();
    connection.on('error', (err: MysqlError) => {
      this.handleConnectionLost(err, options);
    });
    return connection;
  }


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
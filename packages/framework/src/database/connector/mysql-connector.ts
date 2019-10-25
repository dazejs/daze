import { createConnection, ConnectionConfig } from 'mysql'
import { ConnectorInterface } from './connector.interface'

// Mysql 连接器
export class MysqlConnector implements ConnectorInterface {
  connect(options: string | ConnectionConfig) {
    const connection = createConnection(options);
    connection.connect();
    return connection
  }
}
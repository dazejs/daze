import { Connection } from 'mysql'
import { ConnectionInterface } from './connection.interface'

export class MysqlConnection implements ConnectionInterface {

  /**
   * Mysql connection
   */
  connection: Connection;

  /**
   * Create Mysql Connection instance
   * @param connection 
   */
  constructor(connection: Connection) {
    this.connection = connection
  }

  select(query: string, bindings: any[] = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, bindings, (error, results) => {
        if (error) return reject(error)
        resolve(results)
      })
    })
  }
}
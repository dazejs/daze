import * as mysql from 'mysql';

async function dropTable(connection: mysql.Connection, table: string) {
  await new Promise((resolve, reject) => {
    connection.query(`DROP TABLE \`${table}\``, (err) => {
      if (err) {
        if (err.code === 'ER_BAD_TABLE_ERROR') {
          return resolve(true);
        } else {
          console.error('[DROP ERROR] - ', err.message);
          return reject(err);
        }
      }
      return resolve(true);
    });
  });
}

async function createTable(connection: mysql.Connection, sql: string) {
  await new Promise((resolve, reject) => {
    connection.query(sql, (err) => {
      if (err) {
        console.error('[CREATE ERROR] - ', err.message);
        return reject(err);
      }
      return resolve();
    });
  });
}


export async function initDb() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'daze',
    port: 13306
  });

  connection.connect();

  // 删除 users 表
  await dropTable(connection, 'users');
  // 创建 users 表
  await createTable(connection, `CREATE TABLE \`users\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL DEFAULT '',
      \`age\` int(11) NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`);

  connection.end();
}
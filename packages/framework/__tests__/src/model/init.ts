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
      return resolve(true);
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
  // 删除 users 表
  await dropTable(connection, 'profiles');
  // 删除 comments 表
  await dropTable(connection, 'comments');
  // 删除 roles 表
  await dropTable(connection, 'roles');
  // 删除 user_role 表
  await dropTable(connection, 'user_role');
  // 创建 users 表
  await createTable(connection, `CREATE TABLE \`users\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL DEFAULT '',
      \`age\` int(11) NOT NULL,
      \`description\` varchar(255) DEFAULT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`);
  // 创建 profiles 表
  await createTable(connection, `CREATE TABLE \`profiles\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`user_id\` int(11) NOT NULL,
      \`motto\` varchar(11) NOT NULL DEFAULT '',
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);
  // 创建 comments 表
  await createTable(connection, `CREATE TABLE \`comments\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`user_id\` int(11) NOT NULL,
      \`comment\` varchar(11) NOT NULL DEFAULT '',
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);
  // 创建 roles 表
  await createTable(connection, `CREATE TABLE \`roles\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`description\` varchar(11) NOT NULL DEFAULT '',
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);
  // 创建 user_role 表
  await createTable(connection, `CREATE TABLE \`user_role\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`user_id\` int(11) NOT NULL,
      \`role_id\` int(11) NOT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;`);

  connection.end();
}
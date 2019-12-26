export default {
  default: {
    type: 'mysql',
    host: 'mysql',
    user: 'root',
    password: 'root',
    port: 13306,
    database: 'daze'
  },
  session: {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379
  }
};

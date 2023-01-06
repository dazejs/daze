
export default {
  /**
     * 默认 Redis 连接
     */
  default: {
    host: 'localhost',
    port: 6379
  },

  /**
     * 缓存专用默认 reids 连接
     * 未定义的情况下，默认使用 default 连接
     */
  // cache: {
  //     host: 'localhost',
  //     port: 6379
  // },

  /**
     * 任务调度专用默认 reids 连接
     * 未定义的情况下，默认使用 default 连接
     */
  // schedule: {
  //     host: 'localhost',
  //     port: 6379
  // },
};
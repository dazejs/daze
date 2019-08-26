

module.exports = {
  /**
   * HTTP service port
   */
  port: 8005,

  /**
   * Encryption Key
   *
   * This key is used by cookie or others
   * should be set to a random, 32 character string
   * if set empty, application will auto set with app started
   */
  keys: ['SEKRIT1'],

  algorithm: 'sha1',

  encoding: 'base64',

  /**
   * static server with public path
   *
   * public - enabled or disabled public static resource request
   *
   * public_prefix - public resource request root dir
   */
  public: true,

  public_prefix: '/',

  /**
   * View config
   *
   * view_extension - The view defaults to the HTML suffix
   */

  view_extension: 'njk',

  /**
   * Cluster
   *
   * cluster.enable - enable or disable cluster mode
   *
   * cluster.workers - Number of work processes, set to 0 by default using CPU cores
   *
   * cluster.sticky - ticky session
   */
  cluster: {
    enable: false,
    workers: 0,
    sticky: false,
  },

  /**
   * debug mode
   */
  debug: true,

  /**
   * template
   */
  http_exception_template: {
    /* ex: 404: 'errors/404.njk', root path: /views */
  },

  providers: [
    require.resolve('../provider/bootstrap'),
  ],
};



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
   * CORS
   *
   * cors.origin - Configures the Access-Control-Allow-Origin CORS header. expects a string.
   * Can also be set to a function, which takes the ctx as the first parameter.
   *
   * cors.exposeHeaders - Configures the Access-Control-Expose-Headers CORS header.
   * Expects a comma-delimited array.
   *
   * cors.maxAge - Configures the Access-Control-Max-Age CORS header. Expects a Number.
   *
   * cors.credentials - Configures the Access-Control-Allow-Credentials CORS header.
   * Expects a Boolean.
   *
   * cors.allowMethods - Configures the Access-Control-Allow-Methods CORS header.
   * Expects a comma-delimited array , If not specified
   * default allowMethods is ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].
   *
   * cors.allowHeaders - Configures the Access-Control-Allow-Headers CORS header.
   * Expects a comma-delimited array . If not specified, defaults to reflecting
   * the headers specified in the request's Access-Control-Request-Headers header.
   */
  cors: {
    enable: true,
    origin: '*',
    exposeHeaders: [],
    maxAge: 5,
    credentials: false,
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  },

  /**
   * template
   */
  http_exception_template: {
    /* ex: 404: 'errors/404.njk', root path /views */
  },

  form: {
    max_file_size: 50 * 2014 * 1024,
  },
  body_limit: '5mb',


  // providers: [
  //   require.resolve('../app/provider/middleware.provider'),
  // ],
};

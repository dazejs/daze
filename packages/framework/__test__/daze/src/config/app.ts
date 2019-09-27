export default {
  port: 8888,
  proxy: false,
  cluster: {
    enable: false, /* enable cluster mode */
    workers: 0, /* Number of work processes, set to 0 by default using CPU cores */
    sticky: false, /* sticky session */
  },
  view_extension: 'html',
};

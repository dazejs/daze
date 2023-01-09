export default {
    /**
     * debug mode
     * 
     * Be sure to turn debug off in a production environment
     */
    debug: true,
  
    /**
     * static server with public path
     *
     * public - enabled or disabled public static resource request
     *
     * public_prefix - public resource request root dir
     */
    public: true,
  
    publicPrefix: '/assets',
  
  
    /**
     * Turn on compression
     * 
     * compress - enable compression
     * 
     * threshold - The compression threshold
     */
    compress: true,
  
    threshold: 1024,
  
    /**
     * View config
     *
     * view_extension - The view defaults to the HTML suffix
     */
  
    viewExtension: 'html',
  
    /**
     * Cluster
     *
     * enable - enable or disable cluster mode
     *
     * workers - Number of work processes, set to 0 by default using CPU cores
     *
     * sticky - ticky session
     */
  
    cluster: false,
  
    workers: 0,
  
    sticky: false,
  
    /**
     * template
     */
    httpErrorTemplate: {
      /* ex: 404: 'errors/404.njk', root path: /views */
    },
  
    providers: [],
  };
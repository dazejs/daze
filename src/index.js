/**
 * Dazejs - A Javascript Framework For Nodejs
 *
 * @package  @dazejs/framework
 * @author   Chan Zewail <chanzewail@gmail.com>
 */
const { Application } = require('@dazejs/framework');

/**
 * Create The Application
 */
const app = new Application(__dirname);

/**
 * Load Module
 */
// app.loadModule('app.module');

// app.loadModule('user.module');

// app.enablePublic('/aa', 'foo');
// app.enablePublic('/bb', 'bar');

/**
 * Run The Application
 */
app.run();

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
 * Run The Application
 */
app.run();

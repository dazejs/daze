/**
 * daze.js - A Javascript Framework For Nodejs
 *
 * @package  @dazejs/framework
 * @author   Chan Zewail <chanzewail@gmail.com>
 */
const { Container } = require('@dazejs/framework')

Container.get('app', [__dirname]).run()

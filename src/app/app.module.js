const { Decorators } = require('@dazejs/framework')

class AppModule {
  modules = [
    'user.module.js',
  ];

  controllers = [
    'hello.js',
  ];

  middlewares = ['axios'];
}

module.exports = AppModule

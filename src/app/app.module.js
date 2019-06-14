const {
  Module, CrossOrigin, useMiddleware,
} = require('@dazejs/framework');

@Module()
@useMiddleware((request, next) => {
  console.log(1111);
  return next();
})
class AppModule {
  resolve() {
    this.run('hello.js');
  }
}

module.exports = AppModule;

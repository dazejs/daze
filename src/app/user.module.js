const {
  Module, CrossOrigin, useMiddleware,
} = require('@dazejs/framework');

@Module()
@useMiddleware((request, next) => {
  console.log(222);
  return next();
})
class AppModule {
  resolve() {

  }
}

module.exports = AppModule;

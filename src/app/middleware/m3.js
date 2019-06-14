const { Middleware } = require('@dazejs/framework')

@Middleware()
class Res {
  resolve(request, next) {
    console.log('到 m3 了')
    next()
  }
}

module.exports = Res

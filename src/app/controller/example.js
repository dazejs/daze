const { Decorators, Controller } = require('@dazejs/framework')

@Decorators.Router('example')
class Example extends Controller {
  @Decorators.Get('login')
  create() {
    app('logger').info('im login %o', { xxx: 111 })
    return view('example/login')
  }

  @Decorators.Post('login')
  store() {
    return res().Created()
  }
}

module.exports = Example

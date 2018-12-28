const { Decorators, Controller } = require('@dazejs/framework')

@Decorators.Router('example')
class Example extends Controller {
  @Decorators.Get('login')
  create() {
    return view('example/login')
  }

  @Decorators.Post('login')
  store() {
    return res().Created()
  }
}

module.exports = Example

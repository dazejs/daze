
const { Decorators, Controller } = require('@dazejs/framework')

@Decorators.Controller('/aaa')
class Aaa extends Controller {
  @Decorators.Get()
  index() {
    return this.render('hello')
  }
}

module.exports = Aaa

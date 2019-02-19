
const { Decorators, Controller } = require('@dazejs/framework')

@Decorators.Router()
class Hello extends Controller {
  @Decorators.Get()
  index() {
    return this.render('hello')
  }
}

module.exports = Hello

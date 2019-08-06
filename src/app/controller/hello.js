
const {
  Controller, Http,
} = require('@dazejs/framework');

@Controller()
class Hello {
  @Http.Get()
  index() {
    return this.render('hello', {
      name: 'Daze.js',
    });
  }
}

module.exports = Hello;


const {
  Controller, Http,
} = require('@dazejs/framework');

@Controller()
class Hello {
  @Http.Get()
  index() {
    return this.ren11der('hello', {
      name: 'Daze.js',
    });
  }
}


module.exports = Hello;

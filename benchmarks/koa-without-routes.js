
const Koa = require('koa');

const app = new Koa()


const controller = (ctx, next) => {
  ctx.body = 'Hello World'
}

app.use(controller)

app.listen(3000)

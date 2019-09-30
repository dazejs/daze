const { Application, Controller, Provider, Response } = require('../packages/framework/dist')

const app = new Application(__dirname)


class RoutesProvider extends Provider {
  launch() {
    this.app.get('middleware').register((request) => {
      return (new Response()).OK('Hello World').send(request)
    })
  }
}

app.disableBodyParser()

app.disableSession()

app.register(new RoutesProvider(app))

app.run(3000)



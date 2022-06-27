const { Application, BaseController, BaseProvider, Response } = require('../packages/framework/dist')

const app = new Application(__dirname)

class Hello extends BaseController {
  index() {
    return 'Hello World'
  }
}

app.multiton(Hello, Hello)

class RoutesProvider extends BaseProvider {
  launch() {
    const router = this.app.get('router')
    for (let index1 = 0; index1 < 10; index1++) {
      for (let index2 = 0; index2 < 10; index2++) {
        for (let index3 = 0; index3 < 10; index3++) {
          const url = `/uuid${index1}/uuid${index2}/uuid${index3}`
          router.register(url, ['GET'], {}, Hello, 'index', [])
        }
      }
    }
  }
}

app.disableBodyParser()

app.disableSession()

app.register(new RoutesProvider(app))

app.run(3000)



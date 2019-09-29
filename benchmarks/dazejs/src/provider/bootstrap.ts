import { Provider } from '@dazejs/framework'
import Controller from '../app/controller'

export default class extends Provider {
  launch() {
    for (let index1 = 1; index1 <= 10; index1++) {
      for (let index2 = 1; index2 <= 10; index2++) {
        for (let index3 = 1; index3 <= 10; index3++) {
          const url = `/pathto${index1}/pathto${index2}/pathto${index3}`
          this.app.get('router').register(url, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], Controller, 'hello', [])
        }
      }
    }
  }
}
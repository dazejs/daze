import { Application } from '@dazejs/framework'

const app = new Application(__dirname)

app.disableBodyParser()

app.disableSession()

app.run()
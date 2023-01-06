import { Provide, Provider, AppendAgent } from '../../../decorators';
import { Mailer } from '../../../supports/mailer';
import { Application } from '../../../foundation/application';


@Provider()
@AppendAgent()
export class MailerProvider{
  @Provide(Mailer)
  mailer() {
    return new Mailer();
  }

  @Provide('mail')
  mailerAlias(app: Application) {
    return app.get(Mailer);
  }
}
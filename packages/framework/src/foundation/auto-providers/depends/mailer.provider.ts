import { provide, Provider, AppendAgent } from '../../../decorators';
import { Mailer } from '../../../mailer';
import { Application } from '../../application';


@Provider()
@AppendAgent()
export class MailerProvider{
  @provide(Mailer)
  mailer() {
    return new Mailer();
  }

  @provide('mail')
  mailerAlias(app: Application) {
    return app.get(Mailer);
  }
}
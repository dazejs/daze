import { Provide, Provider, AppendAgent } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Application } from '../../../foundation/application';
import { Container } from '../../../container';
import { ScheduleService } from '../../../supports/schedule';

@Provider()
@AppendAgent()
export class ScheduleProvider implements ProviderInterface {
  app: Application = Container.get('app');

  @Provide(ScheduleService)
  schedule() {
    return new ScheduleService(this.app);
  }
}
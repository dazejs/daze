import { Agent } from '../../../decorators';
import { Application } from '../../application';
import { Container } from '../../../container';
import { ScheduleService } from '../../../supports/schedule';

/**
 * 在 Agent 进程处理定时任务
 */
@Agent()
export class ScheduleAgent {
  app: Application = Container.get('app');

  resolve() {
    this.app.get<ScheduleService>(ScheduleService).start();
  }
}
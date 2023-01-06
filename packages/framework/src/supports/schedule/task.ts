import { Scheduler } from './scheduler';
import { Matcher } from './matcher';
import { Application } from '../../foundation/application';
import { Container } from '../../container';
import { CornParser } from './corn-parser';
import { cache, config } from '../../helpers';
import { format } from 'date-fns';

/**
 * 任务实例
 */
export class Task {
  /**
     * 定时实例
     */
  private scheduler: Scheduler;

  /**
     * corn 匹配器实例
     */
  private matcher = new Matcher();

  /**
     * 应用程序实例
     */
  private app: Application = Container.get('app');

  /**
     * 具体执行的任务函数
     */
  private func: any;

  /**
     * 表达式解析器
     */
  private cornParser = new CornParser();

  /**
     * 任务名称
     */
  private name: string;

  /**
     * 构造方法
     * @param scheduler 
     * @param func 
     */
  constructor(scheduler: Scheduler, name: string, func: any) {
    this.scheduler = scheduler;
    this.func = func;
    this.name = name;
  }

  /**
     * 是否匹配
     * @param currentDate 
     * @returns 
     */
  match(currentDate: Date) {
    const expression = this.cornParser.interprete(this.scheduler.getExpression());
    return this.matcher.match(
      expression,
      currentDate,
      this.scheduler.getTimezone()
    );
  }
    
  /**
     * 执行任务
     */
  async execute() {
    if (typeof this.func !== 'function') return;
    try {
      if (this.scheduler.isRunOnSingletonServer()) {
        const serverShouldRun = await this.serverShouldRun();
        if (serverShouldRun) {
          await this.func();
        }
      } else {
        await this.func();
      }
    } catch (err: any) {
      this.app.emit('error', err);
    }
  }

  /**
     * 是否独立服务器运行
     * @returns 
     */
  async serverShouldRun() {
    const hasScheduleRedis = config().has('redis.schedule');
    const connection = hasScheduleRedis ? 'schedule' : 'default';
    return cache('redis', connection).add(`schedule.${this.name}.${format(Date.now(), 'HHmm')}`, true, 3600);
  }
}
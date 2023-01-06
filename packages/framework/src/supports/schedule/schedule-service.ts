import { EventEmitter } from 'events';
import { Application } from '../../foundation/application';
import { Scheduler } from './scheduler';
import { Task } from './task';

/**
 * 定时任务服务
 */
export class ScheduleService extends EventEmitter {
  /**
     * Application
     */
  private app: Application;

  /**
     * 定时器
     */
  private timeout: NodeJS.Timeout;

  /**
     * 任务集合
     */
  private tasks: Task[] = [];

  /**
     * Constructor
     * @param app 
     */
  constructor(app: Application) {
    super();
    this.app = app;
  }

  /**
     * 注册用户 Schedule 模块
     * @param scheduleKlass 
     */
  public register(scheduleKlass: any) {
    if (scheduleKlass.prototype && Reflect.getMetadata('type', scheduleKlass) === 'schedule') {
      this.parseScheduler(scheduleKlass);
    }
  }

  /**
     * 解析模块
     * @param scheduleKlass 
     */
  private parseScheduler(scheduleKlass: any) {
    const schedule = this.app.get(scheduleKlass);
    const cornMap: Map<string, Scheduler> = Reflect.getMetadata('corn', scheduleKlass) ?? new Map();
    for (const [key, scheduler] of cornMap) {
      this.tasks.push(new Task(scheduler, key, schedule[key].bind(schedule)));
    }
  }

  /**
     * 启动定时任务
     */
  public start() {
    let lastCheck = process.hrtime();
    let lastExecution = Date.now();
    const matchTime = () => {
      if (!this.tasks.length) return;
      const elapsedTime = process.hrtime(lastCheck);
      const elapsedMs = (elapsedTime[0] * 1e9 + elapsedTime[1]) / 1e6;
      const missedExecutions = Math.floor(elapsedMs / 1000);
      for (let i = missedExecutions; i >= 0; i--) {
        const date = Date.now() - i * 1000;
        if (lastExecution < date && i === 0) {
          for (const task of this.tasks) {
            if (task.match(new Date(date))) {
              task.execute();
              lastExecution = date;
            }
          }
        }
      }
      lastCheck = process.hrtime();
      this.timeout = setTimeout(matchTime, 1000);
    };
    matchTime();
  }

  /**
     * 停止定时任务
     */
  public stop() {
    this.timeout && clearTimeout(this.timeout);
  }
}
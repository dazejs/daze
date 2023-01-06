import Transport, { TransportStreamOptions } from 'winston-transport';
import cluster from 'cluster';
import * as winston from 'winston';
import { Application } from '../../foundation/application';
import { LOGGER_PROCESS_MESSAGE } from './consts';
import { Logger } from './logger';
import { Messenger } from '../../messenger';
import { Container } from '../../container';

export class ClusterTransport extends Transport {
  app: Application;

  channelName: string;
  loggerName: string;

  static instances: Logger[] = [];

  constructor(loggerName: string, channelName: string, app: Application, opts?: TransportStreamOptions) {
    super(opts);
    this.app = app;
    this.loggerName = loggerName;
    this.channelName = channelName;
  }

  static bindListener(instance: Logger) {
    const messenger: Messenger = Container.get(Messenger);
    if (messenger.listenerCount('loggerCluster') >= 1) {
      this.instances.push(instance);
    } else {
      this.instances.push(instance);
      messenger.on('loggerCluster', (info: any) => {
        // 日志消息
        if (info.cmd && info.cmd === LOGGER_PROCESS_MESSAGE) {
          const { level, msg, meta = {}, worker: _worker, loggerName, channelName } = info;
          const instances = this.instances.filter(instance => instance.loggerName === loggerName);
          if (instances.length) {
            for (const ins of instances) {
              ins.channel(channelName).log(level, msg, {
                ...meta,
                worker: _worker,
                channelName,
                loggerName
              });
            }
          } else {
            winston.log(level, msg, {
              ...meta,
              worker: _worker,
            });
          }
        }
      });
    }
  }

  log(info: any, next: any) {
    if (this.silent) {
      return next(null,  true);
    }
    if (this.app.isWorker && cluster.worker?.id) {
      const { level, message, ...meta } = info;
      const msg = {
        cmd: LOGGER_PROCESS_MESSAGE,
        worker: cluster.worker.id,
        channelName: this.channelName,
        loggerName: this.loggerName,
        level: level,
        msg: message,
        meta: {
          processId: process.pid,
          ...meta
        }
      };
      this.app.get<Messenger>(Messenger).broadcastToAgent('loggerCluster',  msg);
    }
    next();
  }
}
import commander from 'commander';
import { DevAction } from '../actions';

/**
 * 开发模式命令声明
 */
export class DevCommand {
  /**
     * Command
     */
  private program: commander.Command;

  /**
     * constructor
     * @param program 
     */
  constructor(program: commander.Command) {
    this.program = program;
  }

  /**
     * 命令的实现
     * @param action 
     */
  resolve(action: DevAction) {
    this.program
      .command('dev')
      .alias('d')
      .description('应用程序开发模式.')
      .option('--inspect [hostport]', '启动服务端调试模式')
      .option('--debug', '启动 debug 模式')
      .action(async (destination: any) => {
        if (!process.env.DAZE_ENV) {
          process.env.DAZE_ENV = 'dev';
        }
        action.resolve(destination);
      });
  }
}
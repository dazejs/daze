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
      .option('--csr', '客户端编译使用 CSR 方式')
      .option('--spa', '单页的形式构建项目')
      .option('--mpa', '多页的形式构建项目')
      .option('--debug', '启动 debug 模式')
      .option('--client-only', '只编译客户端目录')
      .option('--server-only', '只编译服务端目录')
      .action(async (destination: any) => {
        action.resolve(destination);
      });
  }
}
import commander from 'commander';
import { BuildAction } from '../actions';

export class BuildCommand {

  private program: commander.Command;

  constructor(program: commander.Command) {
    this.program = program;
  }

  resolve(action: BuildAction) {
    this.program
      .command('build')
      .alias('b')
      .description('编译应用程序.')
      .option('--csr', '客户端编译使用 CSR 方式')
      .option('--spa', '单页的形式构建项目')
      .option('--mpa', '多页的形式构建项目')
      .option('--client-only', '只编译客户端目录')
      .option('--server-only', '只编译服务端目录')
      .action(async (destination: any) => {
        action.resolve(destination);
      });
  }
}
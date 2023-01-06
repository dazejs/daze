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
      .option('--env <env>', '环境变量')
      .action(async (destination: any) => {
        if (destination.env) {
          process.env.DAZE_ENV = destination.env;
        }
        process.env.NODE_ENV = process.env.DAZE_ENV;
        action.resolve(destination);
      });
  }
}
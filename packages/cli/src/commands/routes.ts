import * as commander from 'commander';
import { RoutesAction } from '../actions';


export class RoutesCommand {

  private program: commander.Command;

  constructor(program: commander.Command) {
    this.program = program;
  }

  resolve(action: RoutesAction) {
    this.program
      .command('routes')
      .alias('r')
      .description('输出项目路由信息.')
      .action(async () => {
        await action.resolve();
      });
  }
}
import * as commander from 'commander';
import { TPLActionAbstract } from '../actions';


export class CreateCommand {

  private program: commander.Command;

  constructor(program: commander.Command) {
    this.program = program;
  }

  resolve(action: TPLActionAbstract) {
    this.program
      .command('create [name]')
      .alias('c')
      .description('创建应用程序.')
      .action(async (name = '', destination: any) => {
        await action.source('application').resolve(name, destination);
      });
  }
}
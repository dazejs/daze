import * as commander from 'commander';
import { TPLActionAbstract } from '../actions';


export class MakeCommand {

  private program: commander.Command;

  constructor(program: commander.Command) {
    this.program = program;
  }

  resolve(action: TPLActionAbstract) {
    this.program
      .command('make:controller [name]')
      .alias('mc')
      .description('创建 Controller 模板文件.')
      .option('-r, --rest', '使用 Rest 风格')
      .option('-p, --path <path>', '控制器所在目录, 默认 [controllers]')
      .action(async (name = '', destination: Record<string, any>) => {
        await action.source('controller').resolve(name, destination);
      });

    this.program
      .command('make:service [name]')
      .alias('ms')
      .description('创建 Service 模板文件.')
      .action(async (name = '', destination: any) => {
        await action.source('service').resolve(name, destination);
      });

    this.program
      .command('make:schedule [name]')
      .alias('mskd')
      .description('创建 Schedule 模板文件.')
      .action(async (name = '', destination: any) => {
        await action.source('schedule').resolve(name, destination);
      });

    this.program
      .command('make:middleware [name]')
      .alias('mm')
      .description('创建 Middleware 模板文件.')
      .action(async (name = '', destination: any) => {
        await action.source('middleware').resolve(name, destination);
      });

    this.program
      .command('make:entity [name]')
      .alias('mm')
      .description('创建 Entity 模板文件.')
      .action(async (name = '', destination: any) => {
        await action.source('entity').resolve(name, destination);
      });

  }
}
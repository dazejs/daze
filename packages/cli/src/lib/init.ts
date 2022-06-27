import { Command } from 'commander';
import { CreateCommand, MakeCommand, RoutesCommand, BuildCommand, DevCommand } from '../commands';
import { CreateAction, MakeAction, RoutesAction, BuildAction, DevAction } from '../actions';

export function init(argv?: string[]) {

  const program = new Command();

  program
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(require('../../package.json').version, '-v, --version');

  new CreateCommand(program)
    .resolve(
      new CreateAction()
    );

  new MakeCommand(program)
    .resolve(
      new MakeAction()
    );

  new RoutesCommand(program)
    .resolve(
      new RoutesAction()
    );

  new DevCommand(program)
    .resolve(
      new DevAction()
    );

  new BuildCommand(program)
    .resolve(
      new BuildAction()
    );

  program.parse(argv??process.argv);
}
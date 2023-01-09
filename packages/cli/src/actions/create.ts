import { Render, Question, Printer } from '../lib';
import { TPLActionAbstract } from './tpl-action.abstract';
import { NpmRunner, YarnRunner, PNpmRunner} from '../lib/runner';

export class CreateAction extends TPLActionAbstract {

  async resolve(name: string) {
    const answer = await new Question()
      .packageManager()
      .ask();

    const renderer = new Render();

    renderer.source(this._source);
    renderer.destination(name);

    await renderer.apply();

    if (answer.packageManager === 'npm') {
      await new NpmRunner()
        .directory(name)
        .run('install');
    } else if (answer.packageManager === 'yarn') {
      await new YarnRunner()
        .directory(name)
        .run('install');
    } else if (answer.packageManager === 'pnpm') {
      await new PNpmRunner()
        .directory(name)
        .run('install');
    }

    Printer.power();
  }
}
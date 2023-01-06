import { Render, Question, Printer } from '../lib';
import { TPLActionAbstract } from './tpl-action.abstract';
import { NpmRunner, YarnRunner, PPNpmRunner} from '../lib/runner';

export class CreateAction extends TPLActionAbstract {

  async resolve(name: string) {
    const answer = await new Question()
      .projectType()
      .packageManager()
      .productCode()
      .serviceCode()
      .ask();

    const renderer = new Render();

    renderer.source(this._source);
    renderer.destination(name);

    if (answer.projectType === 'ssr') {
      renderer.sourceExt('application_ssr_extra');
      renderer.ssr();
    }

    if (answer.projectType === 'business') {
      renderer.sourceExt('application_ssr_extra');
      renderer.sourceExt('application_business_extra');
      renderer.ssr();
      renderer.business();
    }

    renderer.assign({
      productCode: `${answer.productCode}`,
      serviceCode: `${answer.serviceCode}`,
    });

    await renderer.apply();

    if (answer.packageManager === 'npm') {
      await new NpmRunner()
        .directory(name)
        .run('install');
    } else if (answer.packageManager === 'yarn') {
      await new YarnRunner()
        .directory(name)
        .run('install');
    } else if (answer.packageManager === 'ppnpm') {
      await new PPNpmRunner()
        .directory(name)
        .run('install');
    }

    Printer.power();
  }
}
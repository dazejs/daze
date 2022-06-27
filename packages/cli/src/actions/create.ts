import { Render, Question, Printer } from '../lib';
import { TPLActionAbstract } from './tpl-action.abstract';

export class CreateAction extends TPLActionAbstract {

  async resolve(name: string) {
    const answer = await new Question()
      .projectType()
      .productCode()
      .serviceCode()
      .ask();

    const renderer = new Render();

    renderer.source(this._source);
    renderer.destination(name);

    if (answer.projectType === 'ssr') {
      renderer.ssr();
    }

    renderer.assign({
      productCode: `${answer.productCode}`,
      serviceCode: `${answer.serviceCode}`,
    });

    await renderer.apply();

    Printer.power();
  }
}
import { TPLActionAbstract } from './tpl-action.abstract';
// import { Command } from 'commander';
import { Render } from '../lib';
import pluralize from 'pluralize';
import chalk from 'chalk';


export class MakeAction extends TPLActionAbstract {

  getFilename(name: string) {
    return `${name}.ts`;
  }


  async resolve(name: string, destination: Record<string, any>) {
    const renderer = new Render();

    renderer.source(this._source);
    renderer.destination(destination.path ?? pluralize.plural(this._source));

    renderer.assign({
      name,
    });

    const distname = this.getFilename(name);

    switch(this._source) {
      case 'controller':
        if (destination.rest) {
          await renderer.make('rest.tpl', distname);
        } else {
          await renderer.make('controller.tpl', distname);
        }
        break;
      case 'service':
        await renderer.make('service.tpl', distname);
        break;
      case 'schedule':
        await renderer.make('schedule.tpl', distname);
        break;
      case 'middleware':
        await renderer.make('middleware.tpl', distname);
        break;
      default:
        console.log(
          chalk.red(`不支持该模板`)
        );
        process.exit(1);
    }
  }
}
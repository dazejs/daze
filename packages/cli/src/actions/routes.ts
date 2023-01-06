import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { Application } from '@dazejs/framework';
import { table } from 'table';
import 'ts-node/register';

const cwd = process.cwd();

export class RoutesAction {
  checkProject() {
    if (!fs.existsSync(path.resolve(cwd, './package.json'))) {
      console.log(chalk.red(`请在项目根目录下使用`));
      return false;
    }
    return true;
  }

  async resolve() {
    if (!this.checkProject()) return;
    const app = new Application({
      rootPath: path.join(cwd, './src')
    });
    await app.initialize();
    const routes = app.get('router').getList();
    const data: any[][] = [['No.', 'URI', 'Method', 'Controler']];
    const dataObj: Record<string, any> = {};
    for (const [_, route] of routes.entries()) {
      const file: string = app.getPath(route.controller) ?? '';
      const outputMethod = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      const methods = route.methods.filter((method: string) => outputMethod.includes(method.toUpperCase()));
      // const methodStr = methods.length > 5 ? methods.join(',').toUpperCase() + '...' : methods.join(',').toUpperCase();
      const relativePath = file.replace(cwd, '');
      const routePath = `${!route.uri ? '/' : route.uri}`;
      const source = `${relativePath}#${route.action}`;
      const key = routePath+source;
      if (!dataObj[key]) {
        dataObj[key] = {
          path: routePath,
          methods,
          source
        };
      } else {
        dataObj[key] = {
          ...dataObj[key],
          methods: [...new Set([...dataObj[key].methods, ...methods])],
        };
      }
      // data.push([
      //     `${index + 1}`,
      //     `${!route.uri ? '/' : route.uri}`,
      //     `${methodStr}`,
      //     `${relativePath}#${route.action}`,
      // ]);
    }



    for (const [index, key] of Object.keys(dataObj).entries()) {
      const item = dataObj[key];
      const methodStr = item.methods.length > 5 ? item.methods.join(',').toUpperCase() + '...' : item.methods.join(',').toUpperCase();

      data.push([
        `${index + 1}`,
        `${item.path}`,
        `${methodStr}`,
        `${item.source}`
      ]);
    }

    const str = table(data, {
      header: {
        alignment: 'center',
        content: 'Routes'
      }
    });
    console.log(chalk.green(str));
  }
}
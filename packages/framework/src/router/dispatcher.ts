/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as fs from 'fs';
import mime from 'mime-types';
import * as path from 'path';
import { promisify } from 'util';
// import * as zlib from 'zlib';

import { Container } from '../container';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { Application } from '../foundation/application';
import { Request } from '../request';
import { Response } from '../response';
import { Route } from './route';


// // import { HttpError } from '../errors/http-error'
// // import { ResponseManager } from '../response/manager'

// function type(file: string, ext: string) {
//   return ext !== '' ? path.extname(path.basename(file, ext)) : path.extname(file);
// }

const defaultPublicOptions = {
  maxage: 0,
  gzip: true,
  br: true,
};


export class Dispatcher {
  app: Application = Container.get('app');

  request: Request;

  route: Route;

  publicOptions: any;

  constructor(request: Request, route: Route) {
    this.request = request;
    this.route = route;
    this.publicOptions = {
      ...defaultPublicOptions,
      // ...this.app.get('config').get('app.public', {}),
    };
  }

  /**
   * 判断请求是否是可读请求
   * 可用于判断是否是静态资源请求
   */
  isReadRequest() {
    return this.request.isHead() || this.request.isGet();
  }

  decodePath(undecodePath: string) {
    try {
      return decodeURIComponent(undecodePath);
    } catch (err) {
      return false;
    }
  }

  /**
   * resolve dispatcher
   */
  async resolve() {
    // 如果不是只读请求或者关闭了静态资源服务，直接匹配分发请求到路由模块
    if (
      !this.isReadRequest() ||
      !this.app.get('config').get('app.public')
    ) return this.dispatchToRoute();

    // 将 publicPrefix 路径除去 /
    let publicPrefix = this.app.get('config').get('app.publicPrefix', '');
    publicPrefix = publicPrefix.substr(path.parse(publicPrefix).root.length);

    // 将请求路径除去 /
    let requestPath: string | false = this.request.getPath();
    requestPath = this.decodePath(
      requestPath.substr(path.parse(requestPath).root.length)
    );
    // 如果请求路径不能被 decode 直接响应 400 错误
    if (requestPath === false) return new Response().BadRequest('failed to decode url');

    // 如果请求路径不是以 publicPrefix 路径开始的，直接分发请求到路由匹配器
    if (!requestPath.startsWith(publicPrefix)) return this.dispatchToRoute();

    // 相对静态资源路径
    const assetsPath = path.relative(publicPrefix, requestPath);
    // 绝对静态资源路径
    const staticPath = path.resolve(this.app.publicPath, assetsPath);

    // 如果不存在静态资源
    let stats;
    try {
      stats = await promisify(fs.stat)(staticPath);
    } catch (err) {
      if (['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(err.code)) {
        return this.dispatchToRoute();
      }
    }
    if (!stats || stats?.isDirectory()) {
      return this.dispatchToRoute();
    }

    const response = new Response();

    response.setHeader('Content-Length', stats.size);
    if (!this.request.getHeader('Last-Modified')) response.setHeader('Last-Modified', stats.mtime.toUTCString());
    if (!this.request.getHeader('Cache-Control')) {
      const directives = [`max-age=${this.publicOptions.maxage / 1000 | 0}`];
      response.setHeader('Cache-Control', directives.join(','));
    }
    response.setHeader('Content-Type', mime.lookup(path.extname(staticPath)));

    response.setData(fs.createReadStream(staticPath));
    return response;
  }

  /**
   * dispatch request to controller
   */
  async dispatchToRoute() {
    if (!this.route) {
      throw this.createNotFountError();
    }
    return this.route.middleware
      .handle(this.request, async (request: Request) => this.route.resolve(request))
      .catch((err) => {
        throw err;
      });
    // .then(this.handleResponse())
  }

  // handleResponse() {
  //   return (response: Response) => {
  //     const code = response.getCode();
  //     const data = response.getData();
  //     const headers = response.getHeaders();

  //     if (code >= 400) {
  //       throw new HttpError(code, data, headers);
  //     }
  //     return response
  //   };
  // }

  createNotFountError() {
    return new NotFoundHttpError('Not Found');
  }
}

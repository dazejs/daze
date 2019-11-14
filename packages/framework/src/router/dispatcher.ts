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

import { Container } from '../container';
import { NotFoundHttpError } from '../errors/not-found-http-error';
import { Application } from '../foundation/application';
import { Request } from '../request';
import { Response } from '../response';
import { Route } from './route';


// import { HttpError } from '../errors/http-error'
// import { ResponseManager } from '../response/manager'

function type(file: string, ext: string) {
  return ext !== '' ? path.extname(path.basename(file, ext)) : path.extname(file);
}

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
      ...this.app.get('config').get('app.public', {}),
    };
  }

  /**
   * resolve dispatcher
   */
  async resolve() {
    if (!this.isStaticServerRequest()) return this.dispatchToRoute();
    const staticFilePath = this.getStaticFilePath();
    let stats;
    try {
      stats = await promisify(fs.stat)(staticFilePath);
    } catch (err) {
      if (['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(err.code)) {
        return this.dispatchToRoute();
      }
    }
    if (!stats || stats?.isDirectory()) {
      return this.dispatchToRoute();
    }
    return this.dispatchToStaticServer(staticFilePath, stats);
  }

  /**
   * dispatch request to static server
   */
  async dispatchToStaticServer(staticFilePath: string, stats: fs.Stats) {
    // create response instance
    const response = new Response().staticServer();
    const { maxage } = this.publicOptions;
    let filePath = staticFilePath;

    let encodingExt = '';
    if (this.isEncodingBR(filePath)) {
      filePath += '.br';
      response.setHeader('Content-Encoding', 'br');
      this.request.res.removeHeader('Content-Length');
      encodingExt = '.br';
    } else if (this.isEncodingGZ(filePath)) {
      filePath += '.gz';
      response.setHeader('Content-Encoding', 'gzip');
      this.request.res.removeHeader('Content-Length');
      encodingExt = '.gz';
    }

    response.setHeader('Content-Length', stats.size);
    if (!this.request.getHeader('Last-Modified')) response.setHeader('Last-Modified', stats.mtime.toUTCString());
    if (!this.request.getHeader('Cache-Control')) {
      const directives = [`max-age=${maxage / 1000 | 0}`];
      response.setHeader('Cache-Control', directives.join(','));
    }
    response.setHeader('Content-Type', mime.lookup(type(filePath, encodingExt)));
    response.setData(fs.createReadStream(filePath));
    return response;
  }

  async checkIfStaticServer(filePath: string) {
    if (!this.isStaticServerRequest()) return false;
    let stats;
    try {
      stats = await promisify(fs.stat)(filePath);
    } catch (err) {
      if (['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(err.code)) {
        return false;
      }
    }
    if (stats?.isDirectory()) {
      return false;
    }
    return true;
  }

  /**
   * check if support br encoding
   * @param filePath
   */
  isEncodingBR(filePath: string) {
    return this.publicOptions.br && this.request.acceptsEncodings('br', 'identity') === 'br' && fs.existsSync(`${filePath}.br`);
  }

  /**
   * check if support gzip encoding
   * @param filePath
   */
  isEncodingGZ(filePath: any) {
    return this.publicOptions.gzip && this.request.acceptsEncodings('gzip', 'identity') === 'gzip' && fs.existsSync(`${filePath}.gz`);
  }

  /**
   * return the static server file path
   */
  getStaticFilePath() {
    const requestPath: string = this.request.getPath();
    const filePath = decodeURIComponent(requestPath.substr(path.parse(requestPath).root.length));
    return path.resolve(this.app.publicPath, filePath);
  }

  /**
   * check if the request is support static server
   */
  isStaticServerRequest() {
    return this.request.isHead() || this.request.isGet();
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

/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import mime from 'mime-types'
import { Container } from '../container'
import { Response } from '../response'
import { NotFoundHttpError } from '../errors/not-found-http-error'
import { HttpError } from '../errors/http-error'
import { ResponseManager } from '../response/manager'


function type(file: string, ext: string) {
  return ext !== '' ? path.extname(path.basename(file, ext)) : path.extname(file);
}

const defaultPublicOptions = {
  maxage: 0,
  gzip: true,
  br: true,
};


export class Dispatcher {
  app: any;
  request: any;
  route: any;
  publicOptions: any;
  constructor(request: any, route: any) {
    this.app = Container.get('app');
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
    if (this.route) {
      return this.dispatchToRoute();
    }
    return this.dispatchToStaticServer();
  }

  /**
   * dispatch request to static server
   */
  async dispatchToStaticServer() {
    // create response instance
    const response = new Response().staticServer();
    const { maxage } = this.publicOptions;
    if (this.isStaticServerRequest()) {
      let filePath = this.getStaticFilePath();

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

      let stats;
      try {
        stats = await promisify(fs.stat)(filePath);
      } catch (err) {
        if (['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(err.code)) {
          throw this.createNotFountError();
        }
        throw err;
      }
      if (!stats.isDirectory()) {
        response.setHeader('Content-Length', stats.size);
        if (!this.request.getHeader('Last-Modified')) response.setHeader('Last-Modified', stats.mtime.toUTCString());
        if (!this.request.getHeader('Cache-Control')) {
          const directives = [`max-age=${maxage / 1000 | 0}`];
          response.setHeader('Cache-Control', directives.join(','));
        }
        response.setHeader('Content-Type', mime.lookup(type(filePath, encodingExt)));
        response.setData(fs.createReadStream(filePath));
        // return response;
        return new ResponseManager(response).output(this.request);
      }
    }
    throw this.createNotFountError();
    // return this.errorCatch(error);
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
    const requestPath = this.request.path;
    const filePath = decodeURIComponent(requestPath.substr(path.parse(requestPath).root.length));
    return path.resolve(this.app.publicPath, filePath);
  }

  /**
   * check if the request is support static server
   */
  isStaticServerRequest() {
    return this.request.isHead() || this.request.isGet();
  }

  // errorCatch(error) {
  //   this.app.emit('error', error);
  //   const err = new ErrorHandler(this.request, error);
  //   return this.output(this.request, err.render());
  // }

  /**
   * dispatch request to controller
   */
  async dispatchToRoute() {
    return this.route.middleware
      .handle(this.request, async (request: any) => this.route.resolve(request))
      .then(this.responseFilter())
      .then(async (response: any) => {
        await response.commitCookies(this.request);
        return this.output(this.request, response);
      });
    // .catch((error) => {
    //   this.errorCatch(error);
    // });
  }

  responseFilter() {
    return (response: any) => {
      const code = response.getCode();
      const data = response.getData();
      const headers = response.getHeaders();

      if (code >= 400) {
        throw new HttpError(code, data, headers);
      }
      return response;
    };
  }

  async output(request: any, response: any) {
    return new ResponseManager(response).output(request);
  }

  createNotFountError() {
    return new NotFoundHttpError('Not Found');
  }
}

import * as fs from 'fs';
import mime from 'mime-types';
import * as path from 'path';
import { Str } from '../../utils';
import { promisify } from 'util';
import { Application } from '../../foundation/application';
import { Container } from '../../container';
import { NotFoundHttpError } from '../../errors/not-found-http-error';
import { Request } from '../request';
import { Response } from '../response';
import { Route } from './route';

import debuger from 'debug';

const debug = debuger('@daze/framework:dispatcher');

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

  async resolve() {
    if (!this.route) {
      return this.dispatchToPublic();
    }
    return this.dispatchToRoute();
  }

  /**
     * resolve dispatcher
     */
  async dispatchToPublic() {
    // 如果不是只读请求或者关闭了静态资源服务，直接匹配分发请求到路由模块
    if (!this.isReadRequest() || !this.app.get('config').get('app.public', true)) {
      debug('未开启静态资源访问，直接通过路由处理');
      throw this.createNotFountError();
    }
    // 将 publicPrefix 路径除去 /
    let publicPrefix =
        Str.formatPrefix(this.app.get('config').get('app.baseUrl', '')) +
        Str.formatPrefix(this.app.get('config').get('app.publicPrefix', ''));

    publicPrefix = publicPrefix.substr(path.parse(publicPrefix).root.length);

    // 请求是否 “/” 结尾
    const trailingSlash = this.request.path[this.request.path.length - 1] === '/';
    const publicIndex: string = this.app.get('config').get('app.publicIndex', 'index.html');
    const publicFormat: boolean = this.app.get('config').get('app.publicFormat', true);
    // 将请求路径除去 /
    let requestPath: string | false = this.request.path;
    if (requestPath) {
      requestPath = this.decodePath(
        requestPath.substr(path.parse(requestPath).root.length)
      );
    }
    // 如果请求路径不能被 decode 直接响应 400 错误
    if (requestPath === false) return new Response().BadRequest('failed to decode url');

    // 如果请求路径不是以 publicPrefix 路径开始的，直接分发请求到路由匹配器
    if (!requestPath.startsWith(publicPrefix)) {
      throw this.createNotFountError();
    }

    if (publicIndex && trailingSlash) {
      requestPath += publicIndex;
    }

    // 相对静态资源路径
    const assetsPath = path.relative(publicPrefix, requestPath);
    // 绝对静态资源路径
    const staticPath = path.resolve(this.app.publicPath, assetsPath);

    // 如果不存在静态资源
    let stats;
    let statPath = staticPath;
    let encoding = '';
    const compress = this.app.get('config').get('app.compress', true);
    if (compress) {
      if (
        this.request.acceptsEncodings('br', 'identity') === 'br' &&
                fs.existsSync(statPath + '.br') 
      ) {
        statPath = statPath + '.br';
        encoding = 'br';
      }

      if (
        this.request.acceptsEncodings('gzip', 'identity') === 'gzip' &&
                fs.existsSync(statPath + '.gz') 
      ) {
        statPath = statPath + '.gz';
        encoding = 'gzip';
      }
    }

    try {
      stats = await promisify(fs.stat)(statPath);
      if (publicFormat && stats?.isDirectory()) {
        statPath += `/${publicIndex}`;
        stats = await promisify(fs.stat)(statPath);
      }
    } catch (err: any) {
      if (['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(err.code)) {
        // return this.dispatchToRoute();
        throw this.createNotFountError();
      }
    }

    if (!stats || stats?.isDirectory()) {
      // return this.dispatchToRoute();
      throw this.createNotFountError();
    }

    debug('匹配到静态资源文件, 返回静态资源');

    const response = new Response();
    if (encoding) {
      response.setHeader('Content-Encoding', encoding);
    }
    response.setHeader('Content-Length', stats.size);
    if (!this.request.getHeader('Last-Modified')) response.setHeader('Last-Modified', stats.mtime.toUTCString());
    if (!this.request.getHeader('Cache-Control')) {
      const directives = [`max-age=${this.publicOptions.maxage / 1000 | 0}`];
      response.setHeader('Cache-Control', directives.join(','));
    }
    response.setHeader('Content-Type', mime.lookup(path.extname(staticPath)));

    response.setData(fs.createReadStream(statPath));
    return response;
  }

  /**
     * dispatch request to controller
     */
  async dispatchToRoute(): Promise<any> {
    if (!this.route) {
      return this.dispatchToPublic();
    }
    return this.route.middleware
      .handle(this.request, async (request: Request) => this.route.resolve(request))
      .catch((err) => {
        throw err;
      });
  }

  createNotFountError() {
    return new NotFoundHttpError('Not Found');
  }
}

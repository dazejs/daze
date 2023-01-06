import isGlob from 'is-glob';
import micromatch from 'micromatch';
import url from 'url';
import { Middleware } from '../../../decorators';
import { app } from '../../../helpers';
import { Next } from '../../../http/middleware';
import { HttpProxy } from '../../../http/proxy';
import { Request } from '../../../http/request';
import { MiddlewareInterface } from '../../../interfaces';

@Middleware()
export class ProxyMiddleware implements MiddlewareInterface {
  options: any;

  constructor(options: any) {
    this.options = options;
  }

  async resolve(request: Request, next: Next) {
    let shouldProxyOnWhen = true;
    if (typeof this.options.when === 'function') {
      if (this.options.when(request, app()) === false) shouldProxyOnWhen = false;
    }
    if (shouldProxyOnWhen && this.match(this.options.context, request.url)) {
      // 过滤
      if (this.options.only && Array.isArray(this.options.only) && this.options.only.length) {
        const hasOnly = (this.options.only as string[]).some((uri: string) => this.match(uri, request.url));
        if (!hasOnly) return next();
      }
      if (this.options.except && Array.isArray(this.options.except) && this.options.except.length) {
        const hasExcept = (this.options.except as string[]).some((uri: string) => this.match(uri, request.url));
        if (hasExcept) return next();
      }
      const proxy = new HttpProxy()
        .changeOrigin()
        .target(typeof this.options.target === 'function' ? this.options.target() : this.options.target);
      if (!this.options.rewrite) this.options.rewrite = (p: string) => p;
      if (typeof this.options.rewrite === 'function') {
        proxy.rewrite(this.options.rewrite);
      }
      return proxy;
    }
    return next();
  }

  /**
     * 匹配需要代理的 url
     * @param p 
     * @param uri 
     * @returns 
     */
  private match(p: string, uri: string) {
    if (this.isStringPath(p)) {
      const pathname = this.getUrlPathName(uri) ?? '';
      return pathname.indexOf(p) === 0;
    }
    if (this.isGlobPath(p)) {
      const pathname = this.getUrlPathName(uri) ?? '';
      const matches = micromatch([pathname], p);
      return matches && matches.length > 0;
    }
    return false;
  }

  /**
     * 获取 url 路径
     * @param uri 
     * @returns 
     */
  private getUrlPathName(uri: string) {
    return uri && url.parse(uri).pathname;
  }

  /**
     * 是否纯字符串代理
     * @param p 
     * @returns 
     */
  private isStringPath(p: string) {
    return typeof p === 'string' && !isGlob(p);
  }

  /**
     * glob 格式代理
     * @param p 
     * @returns 
     */
  private isGlobPath(p: string) {
    return isGlob(p);
  }
}
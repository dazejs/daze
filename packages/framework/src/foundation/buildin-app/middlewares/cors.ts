import { Next } from '../../../http/middleware';
import { Request } from '../../../http/request';
import { Response } from '../../../http/response';
import { Order, Middleware } from '../../../decorators';
import { MiddlewareInterface } from  '../../../interfaces';


const defaultOptions = {
  origin: '',
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
};

@Middleware()
@Order(Number.MIN_SAFE_INTEGER)
export class CORSMiddleware implements MiddlewareInterface {
  options: any;
  constructor(options: any) {
    this.options = this.parseOptions(options);
  }

  parseOptions(options: any) {
    if (typeof options === 'string') {
      return {
        ...defaultOptions,
        origin: options,
      };
    } if (options && typeof options === 'object') {
      return {
        ...defaultOptions,
        ...options,
      };
    }
    return defaultOptions;
  }

  get origin() {
    return this.options.origin;
  }

  get maxAge() {
    return this.options.maxAge || 5;
  }

  get credentials() {
    return this.options.credentials || true;
  }

  get allowMethods() {
    return this.options.allowMethods || ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'];
  }

  get allowHeaders() {
    return this.options.allowHeaders || ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'];
  }

  async resolve(request: Request, next: Next): Promise<Response> {
    // Origin Header
    const requestOrigin = request.get('Origin');
    //  Origin Header 不存在的时候
    // 超出了规范的范围，终止
    if (!requestOrigin) return next();
    try {
      // 预检请求
      if (request.isOptions()) {
        // Preflight Request
        if (!request.get('Access-Control-Request-Method')) return next();

        const response = new Response();
        // Origin Vary
        response.setVary('Origin');

        response.setHeader('Access-Control-Allow-Origin', this.origin || requestOrigin || '*');

        if (this.credentials) {
          response.setHeader('Access-Control-Allow-Credentials', true);
        }

        if (this.maxAge) {
          response.setHeader('Access-Control-Max-Age', this.maxAge);
        }

        if (this.allowMethods) {
          response.setHeader('Access-Control-Allow-Methods', this.allowMethods);
        }

        response.setHeader('Access-Control-Allow-Headers', this.allowHeaders || request.get('Access-Control-Request-Headers'));
                
        return response.NoContent();
      }

      const response = await next();
      // Origin Vary
      response.setVary('Origin');

      response.setHeader('Access-Control-Allow-Origin', this.origin || requestOrigin || '*');
      if (this.credentials) {
        response.setHeader('Access-Control-Allow-Credentials', true);
      }
      return response;
    } catch (err: any) {
      throw err;
    }
  }
}

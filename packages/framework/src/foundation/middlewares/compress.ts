import * as zlib from 'zlib';
import { Middleware } from '../../base';
import { Component } from '../../decorators';
import { Stream } from 'stream';


const encodingMethods = {
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate
};

@Component('compress')
export class Compress extends Middleware {

  async resolve(request: any, next: any) {
    const response = await next();

    const encoding: 'gzip' | 'deflate' | 'identity' = request.acceptsEncodings('gzip', 'deflate', 'identity');

    if (!encoding || encoding === 'identity') return response;

    const threshold = this.app.get('config').get('app.threshold', 1024);

    if (threshold > response.getLength()) return response;

    response.setHeader('Content-Encoding', encoding);
    response.res.removeHeader('Content-Length');

    const stream = encodingMethods[encoding]();

    const data = response.getData();

    if (data instanceof Stream) {
      data.pipe(stream);
    } else {
      data.end(stream);
    }

    return response;
  }
}
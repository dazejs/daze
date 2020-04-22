import 'reflect-metadata';
import { rest } from '../../../src/decorators/rest';
import { BaseController } from '../../../src/base/controller';

describe('Rest Decorator', () => {
  it('should patch rest routes and prefix by @Rest', () => {
    @rest('example')
    class Example extends BaseController { }
    expect(Reflect.getMetadata('routes', Example)).toEqual({
      index: [{ uri: '/', method: 'get' }],
      create: [{ uri: '/create', method: 'get' }],
      show: [{ uri: '/:id', method: 'get' }],
      store: [{ uri: '/', method: 'post' }],
      edit: [{ uri: '/:id/edit', method: 'get' }],
      update: [{ uri: '/:id', method: 'put' }],
      destroy: [{ uri: '/:id', method: 'del' }],
    });
    expect(Reflect.getMetadata('prefixs', Example)).toEqual(['/example']);
  });
});

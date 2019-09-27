import 'reflect-metadata';
import { Rest } from '../../../src/decorators/rest';
import { Controller } from '../../../src/base/controller';

describe('Rest Decorator', () => {
  it('should patch rest routes and prefix by @Rest', () => {
    @Rest('example')
    class Example extends Controller { }
    expect(Reflect.getMetadata('routes', Example.prototype)).toEqual({
      index: [{ uri: '/', method: 'get' }],
      create: [{ uri: '/create', method: 'get' }],
      show: [{ uri: '/:id', method: 'get' }],
      store: [{ uri: '/', method: 'post' }],
      edit: [{ uri: '/:id/edit', method: 'get' }],
      update: [{ uri: '/:id', method: 'put' }],
      destroy: [{ uri: '/:id', method: 'del' }],
    });
    expect(Reflect.getMetadata('prefix', Example.prototype)).toBe('/example');
  });
});

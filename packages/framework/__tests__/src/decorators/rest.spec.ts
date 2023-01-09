import 'reflect-metadata';
import { Rest } from '../../../src';

describe('Rest Decorator', () => {
  it('should patch rest routes and prefix by @Rest', () => {
    @Rest('example')
    class Example { }
    expect(Reflect.getMetadata('routes', Example)).toEqual({
      index: [{ uri: '/', method: 'get' }],
      create: [{ uri: '/create', method: 'get' }],
      show: [{ uri: '/:id', method: 'get' }],
      store: [{ uri: '/', method: 'post' }],
      edit: [{ uri: '/:id/edit', method: 'get' }],
      update: [{ uri: '/:id', method: 'put' }],
      destroy: [{ uri: '/:id', method: 'delete' }],
    });
    expect(Reflect.getMetadata('prefixs', Example)).toEqual(['/example']);
  });
});

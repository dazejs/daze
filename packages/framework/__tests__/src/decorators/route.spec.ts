import 'reflect-metadata';
import { controller } from '../../../src';

describe('Controller Decorator', () => {
  it('should patch type and prefix in Controller', () => {
    @controller('example')
    class Example { };
    expect(Reflect.getMetadata('prefixs', Example)).toEqual(['/example']);
  });
});

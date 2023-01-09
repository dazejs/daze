import 'reflect-metadata';
import { Controller } from '../../../src';

describe('Controller Decorator', () => {
  it('should patch type and prefix in Controller', () => {
    @Controller('example')
    class Example { }
    expect(Reflect.getMetadata('prefixs', Example)).toEqual(['/example']);
  });
});

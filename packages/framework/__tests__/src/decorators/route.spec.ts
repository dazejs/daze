import 'reflect-metadata';
import { Route } from '../../../src/decorators/route';

describe('Controller Decorator', () => {
  it('should patch type and prefix in Controller', () => {
    @Route('example')
    class Example { };
    expect(Reflect.getMetadata('prefix', Example)).toBe('/example');
  });
});

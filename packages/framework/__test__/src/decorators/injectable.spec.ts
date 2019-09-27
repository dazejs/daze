import 'reflect-metadata';
import { Injectable } from '../../../src/decorators/injectable';

describe('Injectable Decorator', () => {
  it('should patch Injectable by @Injectable', () => {
    @Injectable()
    class Example { }
    expect(Reflect.getMetadata('injectable', Example.prototype)).toBeTruthy();
  });
});

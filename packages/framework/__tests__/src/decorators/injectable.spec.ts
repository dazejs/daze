import 'reflect-metadata';
import { injectable } from '../../../src/decorators/injectable';

describe('Injectable Decorator', () => {
  it('should patch Injectable by @Injectable', () => {
    @injectable()
    class Example { }
    expect(Reflect.getMetadata('injectable', Example)).toBeTruthy();
  });
});

import 'reflect-metadata';
import { Ignore } from '../../../src/decorators/ignore';

describe('Ignore Decorator', () => {
  it('should patch Ignore by @Ignore', () => {
    @Ignore
    class Example { }
    expect(Reflect.getMetadata('ignore', Example)).toBeTruthy();
  });
});

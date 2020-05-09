import 'reflect-metadata';
import { ignore } from '../../../src/decorators/ignore';

describe('Ignore Decorator', () => {
  it('should patch Ignore by @Ignore', () => {
    @ignore
    class Example { }
    expect(Reflect.getMetadata('ignore', Example)).toBeTruthy();
  });
});

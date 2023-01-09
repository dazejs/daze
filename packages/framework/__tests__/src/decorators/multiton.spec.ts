import 'reflect-metadata';
import { Multiton } from '../../../src/decorators/multiton';
import { MULTITON } from '../../../src/symbol';

describe('Multiton Decorator', () => {
  it('should patch Multiton flag in Multiton', () => {
    @Multiton
    class Example {
     
    }
    expect(Reflect.getMetadata(MULTITON, Example)).toBeTruthy();
  });
});

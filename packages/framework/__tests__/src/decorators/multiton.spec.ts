import 'reflect-metadata';
import { multiton } from '../../../src/decorators/multiton';
import { MULTITON } from '../../../src/symbol';

describe('Multiton Decorator', () => {
  it('should patch Multiton flag in Multiton', () => {
    @multiton
    class Example {
     
    };
    expect(Reflect.getMetadata(MULTITON, Example)).toBeTruthy();
  });
});

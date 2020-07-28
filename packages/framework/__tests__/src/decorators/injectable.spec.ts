import 'reflect-metadata';
import { injectable } from '../../../src/decorators/stereotype/injectable';
import * as symbols from '../../../src/symbol';

describe('Injectable Decorator', () => {
  it('should patch Injectable by @Injectable', () => {
    @injectable
    class Example { }
    expect(Reflect.getMetadata(symbols.INJECTABLE, Example)).toBeTruthy();
  });
});

import 'reflect-metadata';
import { Injectable } from '../../../src/decorators/stereotype/injectable';
import * as symbols from '../../../src/symbol';

describe('Injectable Decorator', () => {
  it('should patch Injectable by @Injectable', () => {
    @Injectable
    class Example { }
    expect(Reflect.getMetadata(symbols.INJECTABLE, Example)).toBeTruthy();
  });
});

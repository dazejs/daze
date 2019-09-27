import 'reflect-metadata';
import { createInjectDecorator } from '../../../../src/decorators/factory/create-inject-decorator';
import * as symbols from '../../../../src/symbol';

describe('Descrators/factory/create-inject-decorator', () => {
  describe('patchClass', () => {
    it('should patch injectable and types in constructor', () => {
      @createInjectDecorator('request')('a', 'b')
      class Klass {
        testname: string;
        constructor() {
          this.testname = '';
        }
      };
      expect(Reflect.getMetadata('injectable', Klass.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.CONSTRUCTOR, Klass.prototype)).toEqual([
        ['request', ['a', 'b']],
      ]);
    });
  });

  describe('patchProperty', () => {
    it('should patch injectable and types in property', () => {
      class Klass {
        @createInjectDecorator('request')('a', 'b')
        testname = '';
      };
      expect(Reflect.getMetadata('injectable', Klass.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.PROPERTY, Klass.prototype)).toEqual({
        testname: ['request', ['a', 'b']],
      });
    });
  });

  describe('patchMethod', () => {
    it('should patch injectable and types in method', () => {
      class Klass {
        @createInjectDecorator('request')('a', 'b')
        index() {}
      };
      expect(Reflect.getMetadata('injectable', Klass.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.METHOD, Klass.prototype)).toEqual({
        index: [
          ['request', ['a', 'b']],
        ],
      });
    });
  });
});

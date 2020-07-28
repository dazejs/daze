import 'reflect-metadata';
import { decoratorFactory } from '../../../../src/decorators/factory/decorator-factory';
import * as symbols from '../../../../src/symbol';

describe('Descrators/factory/create-inject-decorator', () => {
  describe('patchClass', () => {
    it('should patch injectable and types in constructor', () => {
      @decoratorFactory('request', ['a', 'b'])
      class Klass {
        testname: string;
        constructor() {
          this.testname = '';
        }
      };
      expect(Reflect.getMetadata(symbols.INJECTABLE, Klass)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTTYPE_METADATA, Klass)).toEqual([
        {
          abstract: 'request',
          params: ['a', 'b'],
          handler: undefined
        }
      ]);
    });
  });

  describe('patchProperty', () => {
    it('should patch injectable and types in property', () => {
      class Klass {
        @decoratorFactory('request', ['a', 'b'])
        testname = '';
      };
      expect(Reflect.getMetadata(symbols.INJECTABLE, Klass)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTTYPE_METADATA, Klass, 'testname')).toEqual([
        {
          abstract: 'request',
          params: ['a', 'b'],
          handler: undefined
        }
      ]);
    });
  });

  describe('patchMethod', () => {
    it('should patch injectable and types in method', () => {
      class Klass {
        @decoratorFactory('request', ['a', 'b'])
        index() {
          //
        }
      };
      expect(Reflect.getMetadata(symbols.INJECTABLE, Klass)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTTYPE_METADATA, Klass, 'index')).toEqual([
        {
          abstract: 'request',
          params: ['a', 'b'],
          handler: undefined
        }
      ]);
    });
  });
});

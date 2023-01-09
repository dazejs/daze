import 'reflect-metadata';
import { Component } from '../../../src/decorators/stereotype/component';

describe('Component Decorator', () => {
  it('should patch injectable and name in Component', () => {
    @Component('example') 
    class Example { }
    expect(Reflect.getMetadata('name', Example)).toBe('example');
  });
});

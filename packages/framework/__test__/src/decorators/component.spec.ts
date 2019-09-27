import 'reflect-metadata';
import { Component } from '../../../src/decorators/component';

describe('Component Decorator', () => {
  it('should patch injectable and name in Component', () => {
    @Component('example') 
    class Example { };
    expect(Reflect.getMetadata('injectable', Example.prototype)).toBeTruthy();
    expect(Reflect.getMetadata('name', Example.prototype)).toBe('example');
  });
});

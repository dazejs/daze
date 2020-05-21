import 'reflect-metadata';
import { component } from '../../../src/decorators/stereotype/component';

describe('Component Decorator', () => {
  it('should patch injectable and name in Component', () => {
    @component('example') 
    class Example { };
    expect(Reflect.getMetadata('name', Example)).toBe('example');
  });
});

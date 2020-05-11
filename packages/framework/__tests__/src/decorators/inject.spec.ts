import 'reflect-metadata';
import * as path from 'path';
import { Application, inject } from '../../../src';

const app = new Application(
  path.resolve(__dirname, '../../daze')
);

beforeAll(() => app.initialize());


describe('@inject', () => {
  it('should inject with class prop', () => {
    app.singleton('example1', () => 'hello example1', true);
    class Example1 {
      @inject('example1') example1: string;
    }
    app.singleton(Example1, Example1);
    expect(app.get<Example1>(Example1).example1).toBe('hello example1');
  });

  it('should inject with class prop by default name', () => {
    app.singleton('example2', () => 'hello example2', true);
    class Example2 {
      @inject() example2: string;
    }
    app.singleton(Example2, Example2);
    expect(app.get<Example2>(Example2).example2).toBe('hello example2');
  });
});

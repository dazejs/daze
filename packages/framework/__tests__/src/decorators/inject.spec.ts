import 'reflect-metadata';
import * as path from 'path';
import { Application, inject } from '../../../src';
// import { InjectComponent } from '../../daze/src/app/component/InjectComponent';

const app = new Application(
  path.resolve(__dirname, '../../daze/src')
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
});

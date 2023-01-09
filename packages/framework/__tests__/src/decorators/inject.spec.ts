import 'reflect-metadata';
import * as path from 'path';
import { Application, Inject } from '../../../src';
// import { InjectComponent } from '../../daze/src/app/component/InjectComponent';

const app = new Application(
  {
    rootPath: path.resolve(__dirname, '../../daze/src')
  }
);

beforeAll(() => app.initialize());


describe('@Inject', () => {
  it('should inject with class prop', () => {
    app.singleton('example1', () => 'hello example1', true);
    class Example1 {
      @Inject('example1') example1: string;
    }
    app.singleton(Example1, Example1);
    expect(app.get<Example1>(Example1).example1).toBe('hello example1');
  });
});

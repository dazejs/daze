import 'reflect-metadata';
import path from 'path';
import { Application, View } from '../../../src';

const app = new Application({
  rootPath: path.resolve(__dirname, '../../daze/src')
});

beforeAll(() => app.initialize());

describe('View', () => {
  it('View#assign', () => {
    const view = new View();
    view.assign('color', 'blue');
    view.assign({
      name: 'color',
    });
    expect(view.getVars()).toEqual({
      color: 'blue',
      name: 'color',
    });
  });

  it('View#render with ext name', () => {
    const view = new View();
    view.render('index.html', {
      color: 'blue',
    });
    expect(view.getTemplate()).toBe('index.html');
    expect(view.getVars()).toEqual({
      color: 'blue',
    });
  });

  it('View#render without ext name', () => {
    const view = new View();
    view.render('index', {
      color: 'blue',
    });
    expect(view.getTemplate()).toBe('index.html');
    expect(view.getVars()).toEqual({
      color: 'blue',
    });
  });

  it('View#render without template ', () => {
    const view = new View('index');
    view.render({
      color: 'blue',
    });
    expect(view.getTemplate()).toBe('index.html');
    expect(view.getVars()).toEqual({
      color: 'blue',
    });
  });

  it('View#render without template and vars', () => {
    const view = new View('index', {
      color: 'blue',
    });
    view.render();
    expect(view.getTemplate()).toBe('index.html');
    expect(view.getVars()).toEqual({
      color: 'blue',
    });
  });
});

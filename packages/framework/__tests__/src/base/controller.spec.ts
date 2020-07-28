import 'reflect-metadata';
import path from 'path';
import { BaseController, Application, View, injectable } from '../../../src';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Base Controller Class', () => {
  it('should return request instance with request getter', () => {
    const request = {};
    @injectable
    class ExampleController extends BaseController { 
      //
    }
    app.bind(ExampleController, ExampleController);
    const controller = app.get(ExampleController, [request]);
    expect(controller.request).toBe(request);
  });

  it('should return view instance with view method', () => {
    @injectable
    class ExampleController extends BaseController { 
      //
    }
    app.bind(ExampleController, ExampleController);
    const controller = app.get(ExampleController);
    expect(controller.view()).toBeInstanceOf(View);
  });

  it('should return view instance and set view assigns with assign method', () => {
    @injectable
    class ExampleController extends BaseController { 
      //
    }
    app.bind(ExampleController, ExampleController);
    const controller = app.get(ExampleController);
    const res = controller.assign('aaa', 'bbb');
    expect(res).toBeInstanceOf(View);
    expect(res.getVars()).toEqual({
      aaa: 'bbb',
    });
  });

  it('should return view instance and set template with render method', () => {
    @injectable
    class ExampleController extends BaseController { 
      //
    }
    app.bind(ExampleController, ExampleController);
    const controller = app.get(ExampleController);
    const res = controller.render('aaa.html');
    expect(res).toBeInstanceOf(View);
    expect(res.template).toBe('aaa.html');
  });
});

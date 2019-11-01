import path from 'path';
import 'reflect-metadata';
import '../../daze/src/app/controller/example';
import '../../daze/src/provider/app';
import { Controller as ControllerManager } from '../../../src/controller';
import { Application } from '../../../src/foundation/application';
import { Controller } from '../../../src/base';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Controller', () => {
  it('Controller#register', async () => {

    class ExampleController extends Controller {

    }
    
    const instance = new ControllerManager();
    
    instance.register(ExampleController);
    expect(app.get(ExampleController)).toBeInstanceOf(ExampleController);
  });
});

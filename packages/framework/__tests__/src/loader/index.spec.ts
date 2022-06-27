import 'reflect-metadata';
import path from 'path';
import {
  Loader,
  Application,
  BaseController,
  BaseMiddleware,
  BaseService,
  BaseValidator,
  BaseResource,
  controller,
  component,
  service, resourcer, middleware, validator
} from '../../../src';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Loader', () => {
  it('should parse module each type', () => {
    const loader = new Loader();

    @controller()
    class ExampleController extends BaseController { }

    @service('example')
    class ExampleService extends BaseService { }

    @resourcer('example')
    class ExampleResource extends BaseResource {
      resolve(data: any) {
        return data;
      }
    }

    @validator('example')
    class ExampleValidator extends BaseValidator { }

    @middleware('example')
    class ExampleMiddleware extends BaseMiddleware {
      resolve(_request: any, next: any) {
        return next();
      }
    }

    @component('example')
    class ExampleComponent { }

    loader.load(ExampleController, '');
    loader.load(ExampleService, '');
    loader.load(ExampleResource, '');
    loader.load(ExampleMiddleware, '');
    loader.load(ExampleValidator, '');
    loader.load(ExampleComponent, '');

    expect(loader.loadedComponents.get('controller')?.findIndex(e => e.target === ExampleController)).toBeGreaterThan(-1);
    expect(loader.loadedComponents.get('middleware')?.findIndex(e => e.target === ExampleMiddleware)).toBeGreaterThan(-1);
    expect(loader.loadedComponents.get('service')?.findIndex(e => e.target === ExampleService)).toBeGreaterThan(-1);
    expect(loader.loadedComponents.get('resource')?.findIndex(e => e.target === ExampleResource)).toBeGreaterThan(-1);
    expect(loader.loadedComponents.get('validator')?.findIndex(e => e.target === ExampleValidator)).toBeGreaterThan(-1);
    expect(loader.loadedComponents.get('component')?.findIndex(e => e.target === ExampleComponent)).toBeGreaterThan(-1);
  });
});

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

describe('Loader', () => {
  it('should parse module each type', () => {
    const loader = new Loader(app);

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

    loader.load(ExampleController);
    loader.load(ExampleService);
    loader.load(ExampleResource);
    loader.load(ExampleMiddleware);
    loader.load(ExampleValidator);
    loader.load(ExampleComponent);

    expect(loader.loadedComponents.get('controller')?.includes(ExampleController)).toBeTruthy();
    expect(loader.loadedComponents.get('middleware')?.includes(ExampleMiddleware)).toBeTruthy();
    expect(loader.loadedComponents.get('service')?.includes(ExampleService)).toBeTruthy();
    expect(loader.loadedComponents.get('resource')?.includes(ExampleResource)).toBeTruthy();
    expect(loader.loadedComponents.get('validator')?.includes(ExampleValidator)).toBeTruthy();
    expect(loader.loadedComponents.get('component')?.includes(ExampleComponent)).toBeTruthy();
  });
});

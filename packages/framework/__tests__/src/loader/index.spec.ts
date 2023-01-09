import 'reflect-metadata';
import {
  Loader,
  BaseValidator,
  Controller,
  Component,
  Service, Resourcer, Middleware, Validator
} from '../../../src';

describe('Loader', () => {
  it('should parse module each type', () => {
    const loader = new Loader();

    @Controller()
    class ExampleController { }

    @Service('example')
    class ExampleService{ }

    @Resourcer('example')
    class ExampleResource {
      resolve(data: any) {
        return data;
      }
    }

    @Validator('example')
    class ExampleValidator extends BaseValidator { }

    @Middleware('example')
    class ExampleMiddleware {
      resolve(_request: any, next: any) {
        return next();
      }
    }

    @Component('example')
    class ExampleComponent { }

    loader.load(ExampleController, '');
    loader.load(ExampleService, '');
    loader.load(ExampleResource, '');
    loader.load(ExampleMiddleware, '');
    loader.load(ExampleValidator, '');
    loader.load(ExampleComponent, '');

    expect(loader.loadedComponents.get('controller')?.map(t => t.target)?.includes(ExampleController)).toBeTruthy();
    expect(loader.loadedComponents.get('middleware')?.map(t => t.target)?.includes(ExampleMiddleware)).toBeTruthy();
    expect(loader.loadedComponents.get('service')?.map(t => t.target)?.includes(ExampleService)).toBeTruthy();
    expect(loader.loadedComponents.get('resource')?.map(t => t.target)?.includes(ExampleResource)).toBeTruthy();
    expect(loader.loadedComponents.get('validator')?.map(t => t.target)?.includes(ExampleValidator)).toBeTruthy();
    expect(loader.loadedComponents.get('component')?.map(t => t.target)?.includes(ExampleComponent)).toBeTruthy();
  });
});

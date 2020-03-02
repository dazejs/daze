import 'reflect-metadata';
import path from 'path';
import { Loader } from '../../../src/loader';
import { Application } from '../../../src/foundation/application';
import { Controller } from '../../../src/base/controller';
import { Middleware } from '../../../src/base/middleware';
import { Service } from '../../../src/base/service';
import { Validator } from '../../../src/base/validator';
import { Resource } from '../../../src/base/resource';
import { Route, Component } from '../../../src/decorators';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

describe('Loader', () => {
  it('should parse module each type', () => {
    const loader = new Loader(app);

    @Route()
    class ExampleController extends Controller { }

    @Component('example')
    class ExampleService extends Service { }

    @Component('example')
    class ExampleResource extends Resource {
      resolve(data: any) {
        return data;
      }
    }

    @Component('example')
    class ExampleValidator extends Validator { }

    @Component('example')
    class ExampleMiddleware extends Middleware {
      resolve(_request: any, next: any) {
        return next();
      }
    }

    @Component('example')
    class ExampleComponent { }

    loader.load(ExampleController);
    loader.load(ExampleService);
    loader.load(ExampleResource);
    loader.load(ExampleMiddleware);
    loader.load(ExampleValidator);
    loader.load(ExampleComponent);

    expect(loader.loadedComponents.get('controller').includes(ExampleController)).toBeTruthy();
    expect(loader.loadedComponents.get('middleware').includes(ExampleMiddleware)).toBeTruthy();
    expect(loader.loadedComponents.get('service').includes(ExampleService)).toBeTruthy();
    expect(loader.loadedComponents.get('resource').includes(ExampleResource)).toBeTruthy();
    expect(loader.loadedComponents.get('validator').includes(ExampleValidator)).toBeTruthy();
    expect(loader.loadedComponents.get('component').includes(ExampleComponent)).toBeTruthy();
  });
});

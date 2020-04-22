import 'reflect-metadata';
import path from 'path';
import { Loader } from '../../../src/loader';
import { Application } from '../../../src/foundation/application';
import { BaseController } from '../../../src/base/controller';
import { BaseMiddleware } from '../../../src/base/middleware';
import { BaseService } from '../../../src/base/service';
import { BaseValidator } from '../../../src/base/validator';
import { BaseResource } from '../../../src/base/resource';
import { controller, component } from '../../../src/decorators';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

describe('Loader', () => {
  it('should parse module each type', () => {
    const loader = new Loader(app);

    @controller()
    class ExampleController extends BaseController { }

    @component('example')
    class ExampleService extends BaseService { }

    @component('example')
    class ExampleResource extends BaseResource {
      resolve(data: any) {
        return data;
      }
    }

    @component('example')
    class ExampleValidator extends BaseValidator { }

    @component('example')
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

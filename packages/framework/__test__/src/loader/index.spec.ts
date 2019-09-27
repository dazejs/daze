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
import * as symbols from '../../../src/symbol'

const app = new Application(path.resolve(__dirname, '../../daze/src'));

describe('Loader', () => {
  it('should auto load specil file', async () => {
    const loader = new Loader(app);
    const res: any[] = [];
    // @ts-ignore
    loader.loadFile = (filePath) => {
      res.push(filePath);
    };
    await loader.autoLoadApp();
    expect(res.includes(require.resolve('../../daze/src/app/controller/example.ts'))).toBeTruthy();
    expect(res.includes(require.resolve('../../daze/src/app/service/examle.ts'))).toBeTruthy();
  });

  it('should parse module each type', () => {
    const loader = new Loader(app);

    @Route()
    class ExampleController extends Controller { }

    @Component('example')
    class ExampleService extends Service { }

    @Component('example')
    class ExampleResource extends Resource { }

    @Component('example')
    class ExampleValidator extends Validator { }

    @Component('example')
    class ExampleMiddleware extends Middleware { }

    @Component('example')
    class ExampleComponent { }

    loader.parseModule(ExampleController, symbols.ComponentType.Controller);
    loader.parseModule(ExampleService, symbols.ComponentType.Service);
    loader.parseModule(ExampleResource, symbols.ComponentType.Resource);
    loader.parseModule(ExampleMiddleware, symbols.ComponentType.Middleware);
    loader.parseModule(ExampleValidator, symbols.ComponentType.Validator);
    loader.parseModule(ExampleComponent, symbols.ComponentType.Component);

    expect(loader.controllers.includes(ExampleController)).toBeTruthy();
    expect(loader.middlewares.includes(ExampleMiddleware)).toBeTruthy();
    expect(loader.components.includes(ExampleService)).toBeTruthy();
    expect(loader.components.includes(ExampleResource)).toBeTruthy();
    expect(loader.components.includes(ExampleValidator)).toBeTruthy();
    expect(loader.components.includes(ExampleComponent)).toBeTruthy();
  });
});

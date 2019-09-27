import path from 'path';
import 'reflect-metadata';
import '../../daze/src/app/controller/example';
import '../../daze/src/provider/app';
import { createController } from '../../common/helpers';
import { Controller } from '../../../src/controller';
import { Application } from '../../../src/foundation/application';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Controller', () => {
  it('Controller#register', async () => {
    const _Controller = createController();
    const instance = new Controller();
    instance.register(_Controller);
    expect(app.get(_Controller)).toBeInstanceOf(_Controller);
    expect(() => {
      instance.register('string');
    }).toThrow();
    expect(() => {
      instance.register(class {});
    }).toThrow();
  });
});

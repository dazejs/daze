import 'reflect-metadata';
import path from 'path';
import { Base } from '../../../src/base/base';
import { Application } from '../../../src/foundation/application';
import { Config } from '../../../src/config';
import { Messenger } from '../../../src/cluster/messenger';
import { Response } from '../../../src/response';
import { Redirect } from '../../../src/response/redirect';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Base Class', () => {
  it('should return app instance with app prop', () => {
    class Example extends Base {}
    const base = new Example();
    expect(base.app).toBeInstanceOf(Application);
  });

  it('should return config instance with config prop', () => {
    class Example extends Base { }
    const base = new Example();
    expect(base.config).toBeInstanceOf(Config);
  });

  it('should return messenger instance with messenger prop', () => {
    class Example extends Base { }
    const base = new Example();
    expect(base.messenger).toBeInstanceOf(Messenger);
  });

  it('should return response instance with response method', () => {
    class Example extends Base { }
    const base = new Example();
    expect(base.response()).toBeInstanceOf(Response);
  });

  it('should return redirect instance with redirect method', () => {
    class Example extends Base { }
    const base = new Example();
    expect(base.redirect()).toBeInstanceOf(Redirect);
  });
});

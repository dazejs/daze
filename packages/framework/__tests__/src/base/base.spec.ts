import 'reflect-metadata';
import '../../daze/src/app/controller/example';
import '../../daze/src/provider/app';
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
    const base = new Base();
    expect(base.app).toBeInstanceOf(Application);
  });

  it('should return config instance with config prop', () => {
    const base = new Base();
    expect(base.config).toBeInstanceOf(Config);
  });

  it('should return messenger instance with messenger prop', () => {
    const base = new Base();
    expect(base.messenger).toBeInstanceOf(Messenger);
  });

  it('should return response instance with response method', () => {
    const base = new Base();
    expect(base.response()).toBeInstanceOf(Response);
  });

  it('should return redirect instance with redirect method', () => {
    const base = new Base();
    expect(base.redirect()).toBeInstanceOf(Redirect);
  });
});

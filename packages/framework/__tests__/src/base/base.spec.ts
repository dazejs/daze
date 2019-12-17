import 'reflect-metadata';
import path from 'path';

import { OutgoingHttpHeaders } from 'http';

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
    class Example extends Base {
      get app(): Application { return super.app }
    }
    const base = new Example();
    expect(base.app).toBeInstanceOf(Application);
  });

  it('should return config instance with config prop', () => {
    class Example extends Base {
      get config(): Config { return super.config }
    }
    const base = new Example();
    expect(base.config).toBeInstanceOf(Config);
  });

  it('should return messenger instance with messenger prop', () => {
    class Example extends Base {
      get messenger(): Messenger { return super.messenger }
    }
    const base = new Example();
    expect(base.messenger).toBeInstanceOf(Messenger);
  });

  it('should return response instance with response method', () => {
    class Example extends Base {
      response(data?: any, code = 200, header: OutgoingHttpHeaders = {}): Response { 
        return super.response(data, code, header)
      }
    }
    const base = new Example();
    expect(base.response()).toBeInstanceOf(Response);
  });

  it('should return redirect instance with redirect method', () => {
    class Example extends Base {
      redirect(url?: string, code = 200, header: OutgoingHttpHeaders = {}): Redirect { 
        return super.redirect(url, code, header)
      }
    }
    const base = new Example();
    expect(base.redirect()).toBeInstanceOf(Redirect);
  });
});

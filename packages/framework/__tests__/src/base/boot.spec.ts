import 'reflect-metadata';
import { Application } from '../../../src/foundation/application';
import { AppModule } from "../../daze/src/AppModule";
import { TestLogger } from "../../daze/src/app/component/TestLogger";

const app = new Application(AppModule);

beforeAll(() => app.initialize());

describe('Boot module test', () => {
  it('Test App Module', () => {
    const logger = app.get<TestLogger>(TestLogger);
    expect(logger).toBeInstanceOf(TestLogger);
  });
});

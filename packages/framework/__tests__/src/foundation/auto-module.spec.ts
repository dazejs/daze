import 'reflect-metadata';
import { Application } from '../../../src';
import { AppModule } from "../../daze/src/AppModule";
import { TestLogger } from "../../daze/src/app/component/TestLogger";
import { RedisStore } from "../../../src/foundation/auto-modules/redis/redis-store";

const app = new Application(AppModule);

beforeAll(() => app.initialize());

describe('Auto module test', () => {
  it('Test Logger Module', () => {
    const logger = app.get<TestLogger>(TestLogger);
    expect(logger).toBeInstanceOf(TestLogger);
    expect(logger.log('hello log')).toBe('TestLogger(c) => hello log');
  });

  it('Test Provide Config', () => {
    const redisStore = app.get<RedisStore>(RedisStore);
    expect(redisStore).toBeInstanceOf(RedisStore);
    expect(redisStore.getRedisConfig()).toEqual({ host: '127.0.0.1', port: 6379 });
    expect(redisStore.client).toBeTruthy();
  });
});

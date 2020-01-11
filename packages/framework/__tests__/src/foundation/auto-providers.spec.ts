import 'reflect-metadata';
import { Application } from '../../../src';
import { AppProvider } from "../../daze/src/AppProvider";
import { TestLogger, TestLogger2 } from "../../daze/src/app/component/TestLogger";
import { RedisStore } from "../../../src/foundation/auto-providers/redis/redis-store";

const app = new Application(AppProvider);

beforeAll(() => app.initialize());

describe('Auto provider test', () => {
  it('Test Logger Provider', () => {
    const logger = app.get<TestLogger>(TestLogger);
    expect(logger).toBeInstanceOf(TestLogger);
    expect(logger.log('hello log')).toBe('TestLogger(c) => hello log');
    const logger2 = app.get<TestLogger2>(TestLogger2);
    expect(logger2).toBeFalsy();
  });

  it('Test Provide Config', () => {
    const redisStore = app.get<RedisStore>(RedisStore);
    expect(redisStore).toBeInstanceOf(RedisStore);
    expect(redisStore.getRedisConfig()).toEqual({ host: '127.0.0.1', port: 6379 });
    expect(redisStore.client).toBeTruthy();
  });
});

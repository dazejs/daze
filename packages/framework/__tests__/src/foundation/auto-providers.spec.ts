import 'reflect-metadata';
import * as path from 'path';
import { Application } from '../../../src';
import { TestLogger, TestLogger2 } from "../../daze/src/app/component/TestLogger";
import { TestLoggerProvider } from "../../daze/src/provider/test-logger-provider";

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Auto provider test', () => {
  it('Test Logger Provider', () => {
    const testLoggerProvider = app.get<TestLoggerProvider>(TestLoggerProvider);
    expect(testLoggerProvider.testConfig2).toBe("testConfig2");
    expect(testLoggerProvider.testConfig3).toBe("defaultConfig");
    
    const logger = app.get<TestLogger>('testLogger');
    expect(logger).toBeInstanceOf(TestLogger);
    expect(logger.log('hello log')).toBe('TestLogger(c) => hello log');
    const logger2 = app.get<TestLogger2>('testLogger2');
    expect(logger2).toBeFalsy();
  });
});

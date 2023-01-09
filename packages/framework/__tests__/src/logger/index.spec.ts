import 'reflect-metadata';
import path from 'path';
import { Logger, Application } from '../../../src';
import { IllegalArgumentError } from '../../../src/errors/illegal-argument-error';

const app = new Application({
  rootPath: path.resolve(__dirname, '../../daze/src')
});

beforeAll(() => app.initialize());

const log = new Logger(app);
describe('src/logger', () => {
  it('Logger#isDefaultDriverSupported', () => {
    expect(log.isDefaultDriverSupported('console')).toBeTruthy();
    expect(log.isDefaultDriverSupported('file')).toBeTruthy();
    expect(log.isDefaultDriverSupported('http')).toBeTruthy();
    expect(log.isDefaultDriverSupported('stream')).toBeTruthy();
    // expect(log.isDefaultDriverSupported('mongodb')).toBeTruthy();
    expect(log.isDefaultDriverSupported('dailyFile')).toBeTruthy();
    expect(log.isDefaultDriverSupported('custom')).toBeFalsy();
  });

  it('Logger#channl', () => {
    expect((log.channel('console'))).toBe(log.getContainer().get('console'));
    expect(log.channel('dailyFile')).toBe(log.getContainer().get('dailyFile'));
    expect(log.channel('file')).toBe(log.getContainer().get('file'));
    expect(log.channel('http')).toBe(log.getContainer().get('http'));
    expect(log.channel('stream')).toBe(log.getContainer().get('stream'));
    expect(log.channel('compose')).toEqual(log.getContainer().get('compose'));
  });

  it('Logger#getTransports error', () => {
    expect(() => {
      log.getTransports('console2');
    }).toThrowError(IllegalArgumentError);
    expect(() => {
      log.getTransports('console3');
    }).toThrowError(IllegalArgumentError);
  });
});

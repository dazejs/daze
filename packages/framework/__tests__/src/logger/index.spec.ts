import 'reflect-metadata';
import path from 'path';
import { Logger } from '../../../src/logger';
import { Application } from '../../../src/foundation/application';
import { IllegalArgumentError } from '../../../src/errors/illegal-argument-error';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

const log = new Logger();
describe('src/logger', () => {
  it('Logger#isDefaultDriverSupported', () => {
    expect(log.isDefaultDriverSupported('console')).toBeTruthy();
    expect(log.isDefaultDriverSupported('file')).toBeTruthy();
    expect(log.isDefaultDriverSupported('http')).toBeTruthy();
    expect(log.isDefaultDriverSupported('stream')).toBeTruthy();
    expect(log.isDefaultDriverSupported('mongodb')).toBeTruthy();
    expect(log.isDefaultDriverSupported('dailyFile')).toBeTruthy();
    expect(log.isDefaultDriverSupported('custom')).toBeFalsy();
  });

  it('Logger#channl', () => {
    expect(log.channel('console').logger).toBe(log.container.get('console'));
    expect(log.channel('dailyFile').logger).toBe(log.container.get('dailyFile'));
    expect(log.channel('file').logger).toBe(log.container.get('file'));
    expect(log.channel('http').logger).toBe(log.container.get('http'));
    expect(log.channel('stream').logger).toBe(log.container.get('stream'));
    expect(log.channel('compose').logger).toEqual(log.container.get('compose'));
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

import path from 'path';
import 'reflect-metadata';
import { Config } from '../../../src/config';
import appConfig from '../../daze/src/config/app';
import appConfig2 from '../../daze/src/config/app.test';
import customConfig from '../../daze/src/config/custom';
import { Application } from '../../../src/foundation/application';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Config', () => {
  it('Config#get', async () => {
    const configInstance = new Config();
    await configInstance.initialize();
    expect(configInstance.get('app')).toEqual({
      ...appConfig,
      ...appConfig2,
    });
    expect(configInstance.get('custom')).toEqual(customConfig);
    expect(configInstance.get()).toEqual(configInstance._items);
    expect(configInstance.get('app.port')).toBe(8888);
    expect(configInstance.get('app.workers')).toBe(0);
    expect(configInstance.get('custom.a.b.c')).toBe('c');
    expect(configInstance.get('custom.a.b.c', 'd')).toBe('c');
    expect(configInstance.get('custom.a.b.d', 'd')).toBe('d');
  });

  it('Config#has', async () => {
    const configInstance = new Config();
    await configInstance.initialize();
    expect(configInstance.has('app')).toBeTruthy();
    expect(configInstance.has('app.workers')).toBeTruthy();
    expect(configInstance.has('app.undefineProp')).toBeFalsy();
    expect(configInstance.has('custom.a.b.c')).toBeTruthy();
    expect(configInstance.has('custom.a.b.d')).toBeFalsy();
    expect(configInstance.has()).toBeFalsy();
  });

  it('Config#set', async () => {
    const configInstance = new Config();
    await configInstance.initialize();
    configInstance.set('app.port', 9999);
    configInstance.set('custom.a.b.d', 'd');
    expect(configInstance.get('custom.a.b.d')).toBe('d');
    expect(configInstance.get('app.port')).toBe(9999);
  });

  it('Config#prop', async () => {
    const configInstance = new Config();
    await configInstance.initialize();
    expect(configInstance.app.port).toBe(8888);
  });
});

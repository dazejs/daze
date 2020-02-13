import path from 'path';
import 'reflect-metadata';
import { Config } from '../../../src/config';
import { Application } from '../../../src/foundation/application';
import appConfig from '../../daze/src/config/app';
import appConfig2 from '../../daze/src/config/app.test';
import customConfig from '../../daze/src/config/custom';
import { InjectConfigService } from '../../daze/src/app/service/inject-config';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Config', () => {
  it('Config#get', async () => {
    const configInstance = app.get(Config);
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
    const configInstance = app.get(Config);
    await configInstance.initialize();
    expect(configInstance.has('app')).toBeTruthy();
    expect(configInstance.has('app.workers')).toBeTruthy();
    expect(configInstance.has('app.undefineProp')).toBeFalsy();
    expect(configInstance.has('custom.a.b.c')).toBeTruthy();
    expect(configInstance.has('custom.a.b.d')).toBeFalsy();
    expect(configInstance.has()).toBeFalsy();
  });

  it('Config#set', async () => {
    const configInstance = app.get(Config);
    await configInstance.initialize();
    configInstance.set('app.port', 9999);
    configInstance.set('custom.a.b.d', 'd');
    configInstance.set('custom.a.b.e', 'e');
    expect(configInstance.get('custom.a.b.d')).toBe('d');
    expect(configInstance.get('custom.a.b.e')).toBe('e');
    expect(configInstance.get('app.port')).toBe(9999);
  });

  it('Config#prop', async () => {
    const configInstance = app.get(Config);
    await configInstance.initialize();
    expect(configInstance.app.port).toBe(8888);
  });
  
  it('Config#inject', async () => {
    app.singleton(InjectConfigService, InjectConfigService);
    const service = app.make(InjectConfigService);
    expect(service).toBeTruthy();
    expect(service.getTestConfig()).toBe(app.get('config'));
    expect(service.getTestConfig2()).toBe('c');
    expect(service.getTestConfig3()).toBe('testConfig3');
    expect(service.testConfig4).toBe('testConfig44');
  });
});

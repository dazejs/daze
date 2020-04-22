import { config, component } from '../../../../../src/decorators';

@component('injectConfigService')
export class InjectConfigService {

  @config()
  private testConfig = 'testConfig';
  @config('custom.a.b.c')
  private testConfig2 = 'testConfig2';
  @config('custom.a.b.c.d')
  private testConfig3 = 'testConfig3';
  @config('custom.a.b.c.d', 'testConfig44')
  testConfig4 = 'testConfig4';

  getTestConfig() {
    return this.testConfig;
  }

  getTestConfig2() {
    return this.testConfig2;
  }

  getTestConfig3() {
    return this.testConfig3;
  }
}

import { Component, Config } from '../../../../../src/decorators';

@Component('injectConfigService')
export class InjectConfigService {

  @Config()
  private testConfig = 'testConfig';
  @Config('custom.a.b.c')
  private testConfig2 = 'testConfig2';
  @Config('custom.a.b.c.d')
  private testConfig3 = 'testConfig3';
  @Config('custom.a.b.c.d', 'testConfig44')
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

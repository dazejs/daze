import { conf, service } from '../../../../../src/decorators';

@service('injectConfigService')
export class InjectConfigService {

  @conf()
  private testConfig = 'testConfig';
  @conf('custom.a.b.c')
  private testConfig2 = 'testConfig2';
  @conf('custom.a.b.c.d')
  private testConfig3 = 'testConfig3';
  @conf('custom.a.b.c.d', 'testConfig44')
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

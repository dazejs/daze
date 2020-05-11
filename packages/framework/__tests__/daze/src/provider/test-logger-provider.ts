import { depends, provide, provideOn, provideOnMissing } from "../../../../src/decorators";
import { conf } from "../../../../src/decorators";
import { TestLogger, TestLogger2 } from "../app/component/TestLogger";

@depends()
export class TestLoggerProvider {

  @conf("custom.a.b.c")
  private testConfig = "testConfig";

  @conf("custom.a.b.c1")
  testConfig2 = "testConfig2";

  @conf("custom.a.b.c1", "defaultConfig")
  testConfig3 = "testConfig3";

  @provide()
  @provideOnMissing('testLogger')
  testLogger() {
    return new TestLogger(this.testConfig);
  }

  @provide()
  @provideOn("not-exists")
  testLogger2() {
    return new TestLogger2(this.testConfig2);
  }
}
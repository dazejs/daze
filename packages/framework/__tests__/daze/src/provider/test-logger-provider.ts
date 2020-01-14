import { Depend, Provide, ProvideOn, ProvideOnMissing } from "../../../../src/decorators/provider";
import { Config } from "../../../../src/decorators";
import { TestLogger, TestLogger2 } from "../app/component/TestLogger";

@Depend()
export class TestLoggerProvider {

  @Config("custom.a.b.c")
  private testConfig = "testConfig";

  @Config("custom.a.b.c1")
  testConfig2 = "testConfig2";

  @Config("custom.a.b.c1", "defaultConfig")
  testConfig3 = "testConfig3";

  @Provide()
  @ProvideOnMissing('testLogger')
  testLogger() {
    return new TestLogger(this.testConfig);
  }

  @Provide()
  @ProvideOn("not-exists")
  testLogger2() {
    return new TestLogger2(this.testConfig2);
  }
}
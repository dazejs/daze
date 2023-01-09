import { Depends, Provide, ProvideOn, ProvideOnMissing } from "../../../../src/decorators";
import { config } from "../../../../src";
import { TestLogger, TestLogger2 } from "../app/component/TestLogger";

@Depends()
export class TestLoggerProvider {
  @Provide()
  @ProvideOnMissing('testLogger')
  testLogger() {
    return new TestLogger(config("custom.a.b.c", 'testConfig'));
  }

  @Provide()
  @ProvideOn("not-exists")
  testLogger2() {
    return new TestLogger2(config("custom.a.b.c1", "testConfig2"));
  }
}
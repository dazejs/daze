import path from 'path';
import { TestLogger, TestLogger2 } from "./app/component/TestLogger";
import { AutoScan, Depend, Provide, ProvideOn, ProvideOnMissing } from "../../../src/decorators/provider";
import { Config } from "../../../src/decorators";

@Depend([])
@AutoScan([ path.resolve(__dirname, ".") ])
export class AppProvider {
  
  @Config("custom.a.b.c")
  private testConfig = "testConfig";
  
  @Provide()
  @ProvideOnMissing(TestLogger)
  testLogger() {
    return new TestLogger(this.testConfig);
  }

  @Provide()
  @ProvideOn("not-exists")
  testLogger2() {
    return new TestLogger2(this.testConfig);
  }
}

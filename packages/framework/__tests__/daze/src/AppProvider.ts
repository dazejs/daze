import path from 'path';
import { TestLogger, TestLogger2 } from "./app/component/TestLogger";
import { Provide, ProvideOn, ProvideOnMissing, Provider } from "../../../src/decorators/provider";
import { Config } from "../../../src/decorators";

@Provider({
  imports: [],
  componentScan: [ path.resolve(__dirname, ".") ]
})
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

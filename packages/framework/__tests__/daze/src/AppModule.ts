import path from 'path';
import { Config, Module } from "../../../src/decorators";
import { TestLogger } from "./app/component/TestLogger";
import { Provide } from "../../../src/decorators";

@Module({
  imports: [],
  componentScan: [ path.resolve(__dirname, ".") ]
})
export class AppModule {
  
  @Config("custom.a.b.c")
  private testConfig = "testConfig";
  
  @Provide()
  testLogger() {
    return new TestLogger(this.testConfig);
  }
  
}

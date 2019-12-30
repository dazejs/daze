import path from 'path';
import { Module } from "../../../src/boot/module.decorator";
import { TestLogger } from "./app/component/TestLogger";
import { Bean } from "../../../src/boot/bean.decorator";

@Module({
  imports: [],
  componentScan: [ path.resolve(__dirname, ".") ]
})
export class AppModule {
  
  @Bean()
  testLogger() {
    return new TestLogger();
  }
  
}

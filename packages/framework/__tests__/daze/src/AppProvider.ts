import path from 'path';
import { AutoScan, Depend } from "../../../src/decorators/provider";
import { TestLoggerProvider } from "./provider/test-logger-provider";

@Depend([
  TestLoggerProvider
])
@AutoScan([ path.resolve(__dirname, ".") ])
export class AppProvider {
  
}

import { TestLoggerProvider } from '../provider/test-logger-provider';
export default {
  port: 0,
  proxy: false,
  cluster: false,
  workers: 0,
  sticky: false,
  viewExtension: 'html',
  providers: [
    TestLoggerProvider
  ]
};

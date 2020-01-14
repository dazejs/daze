import { TestLoggerProvider } from '../provider/test-logger-provider';
export default {
  port: 8888,
  proxy: false,
  cluster: false,
  workers: 0,
  sticky: false,
  viewExtension: 'html',
  providers: [
    TestLoggerProvider
  ]
};

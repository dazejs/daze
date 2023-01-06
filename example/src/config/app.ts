
import { ExampleProvider } from '../example.provider';

export default {
  cluster: true,
  workers: 2,
  sticky: false,
  baseUrl: '/example',

  public: true,
  publicPrefix: '',
  ssrDevPort: 9988,
  providers: [
    ExampleProvider,
  ]
};
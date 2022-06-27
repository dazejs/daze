
import { ExampleProvider } from '../example.provider';
import { SSRProvider } from '../../../packages/ssr-provider';

export default {
  cluster: true,
  workers: 2,
  sticky: false,

  public: true,
  publicPrefix: '/assets',
  providers: [
    ExampleProvider,
    SSRProvider,
  ]
};
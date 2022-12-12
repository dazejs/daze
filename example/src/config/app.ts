
import { ExampleProvider } from '../example.provider';
import { SSRProvider } from '../../../packages/ssr-provider';

export default {
    cluster: true,
    workers: 2,
    sticky: false,
    baseUrl: '/example',

    productCode: 'example',
    serviceCode: 'example',

    public: true,
    publicPrefix: '',
    ssrDevPort: 9988,
    providers: [
        ExampleProvider,
        SSRProvider
    ]
};
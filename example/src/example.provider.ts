import { Provider, Autowired, Application } from '../../packages/framework/dist';

@Provider()
export class ExampleProvider {
  @Autowired
  app: Application;

  launch() {
    console.log('example');
  }
}
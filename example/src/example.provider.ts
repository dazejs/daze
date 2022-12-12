import { Provider, AppendMaster, AppendAgent, Autowired, Application } from '../../packages/common/dist';

@Provider()
@AppendMaster()
@AppendAgent()
export class ExampleProvider {
    @Autowired
    app: Application;

    launch() {
        // console.dir(this.app.get('router'), {
        //     customInspect: true,
        //     depth: 7
        // });
    }
}
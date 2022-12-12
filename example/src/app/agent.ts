import { Agent, AgentInterface, Application } from '../../../packages/common/dist';

@Agent()
export default class ExampleAgent implements AgentInterface {
    resolve(app: Application) {
        // console.log(1111111);setInterval(() => {
        //     console.log(12312312312);
        // }, 1000);
        // setTimeout(() => {
        //     process.exit(1);
        // }, 3000);
    }
}
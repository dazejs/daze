import { RedisProvider } from "./redis";
import { Provider } from "../../decorators/provider";

@Provider({
  imports: [
    RedisProvider, 
  ],
})
export class DazeBuildInAutoProviders {
  
  
}

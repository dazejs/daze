import { Module } from "../../decorators";
import { RedisAutoModule } from "./redis";

@Module({
  imports: [ 
    RedisAutoModule, 
  ],
})
export class DazeBuildInAutoModule {
  
  
}

import { Provider } from '@tiger/common';

@Provider()
export class BootProvider {
    /**
     * register 钩子方法
     * 服务提供者在注册的时候执行
     * 通常可以在这里进行容器绑定
     */
    async register () {
        //
    }

    /**
     * launch 钩子方法
     * 服务提供者在运行的时候执行
     * 该钩子方法会在所有服务提供者注册完毕后进行调用，所以无需关心 register 中容器绑定的顺序
     */
    async launch () {
        //
    }
}
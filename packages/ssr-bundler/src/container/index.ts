

class Container {
    /**
     * 所有已经加载的模块
     */
    static modules: Map<string, any> = new Map();

    static register(id: string, cb: Function) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const suffix = '/index';
        let key = id;
        if (id.endsWith(suffix)) {
            key = id.slice(0, -suffix.length);
            this.modules.set(key, cb());
        }
        this.modules.set(id, cb());
    }

    static getModule(id: string) {
        return this.modules.get(id);
    }
}

module.exports = Container;
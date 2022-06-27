import { BootProvider } from '../provider/boot';

export default {
    // 产品 code
    productCode: '{{productCode}}',
    // 服务 code
    serviceCode: '{{serviceCode}}',

    /**
     * 应用二级目录
     * 例如应用绑定了host和uri： http://example.com/subdir
     * 那么可以将 baseUrl 设置为 '/subdir'
     */
    baseUrl: '{{serviceCode}}',

    /**
     * 静态资源服务配置
     *
     * public - 是否开启静态资源服务
     *
     * public_prefix - 静态资源的 url 前缀
     */
    public: true,

    publicPrefix: '/assets',

    /**
     * 压缩配置
     *
     * compress - 启用压缩
     *
     * threshold - 压缩阈值
     */
    compress: true,

    threshold: 1024,

    /**
     * 视图配置
     *
     * view_extension - 视图默认后缀
     */

    viewExtension: 'html',

    /**
     * 多进程配置
     *
     * enable - 启用或禁用多进程模式
     *
     * workers - 工作进程数，为 0 时使用 cpu 核心数core
     *
     * sticky - 是否开启粘性会话
     */

    cluster: true,

    workers: 4,

    sticky: false,

    /**
     * 错误模板配置
     */
    httpErrorTemplate: {
        /* ex: 404: 'errors/404.html', root path: /views */
    },

    /**
     * 扩展服务提供者
     */
    providers: [
        BootProvider
    ]
};
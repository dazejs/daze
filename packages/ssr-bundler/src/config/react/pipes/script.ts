import WebpackChain from 'webpack-chain';



function addBabelLoader(chain: WebpackChain.Rule<WebpackChain.Module>, option: {
    corejs: boolean,
    isServerSide?: boolean
} = {
        corejs: false
    }) {
    const envOption: any = {
        modules: false,
        loose: true,
    };

    if (option.corejs) {
        envOption.corejs = {
            version: 3,
            proposals: true
        };
        envOption.useBuiltIns = 'usage';
    }

    chain.use('babel-loader')
        .loader(require.resolve('babel-loader'))
        .options({
            sourceType: 'unambiguous',
            presets: [
                [
                    require.resolve('@babel/preset-env'),
                    envOption
                ],
                require.resolve('@babel/preset-react'),
                require.resolve('@babel/preset-typescript')
            ],
            plugins: [
                [require.resolve('@babel/plugin-transform-runtime')],
                [
                    require.resolve('babel-plugin-import'),
                    {
                        libraryName: 'antd',
                        libraryDirectory: 'lib',
                        style: true
                    },
                    'antd'
                ],
                [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
                [require.resolve('@babel/plugin-proposal-private-methods'), { loose: true }],
                [require.resolve('@loadable/babel-plugin')]
            ]
        })
        .end();
}

export function scriptPipe(chain: WebpackChain, _option = {
    isServerSide: false
}) {
    const babelModule = chain.module
        .rule('compileBabel')
        .test(/\.(js|mjs|jsx|ts|tsx)$/)
        .exclude
        .add(/node_modules/)
        .end();
    // isServerSide == true 时为服务端，不加载 corejs
    addBabelLoader(babelModule, {
        corejs: true,
        isServerSide: _option.isServerSide,
    });
}
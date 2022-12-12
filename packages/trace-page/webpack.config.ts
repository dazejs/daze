import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

const config: webpack.Configuration = {
  entry: {
    main: "./template/index.ts",
  },
  output: {
    path: path.resolve(__dirname, './dist/template'),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  [ "autoprefixer", {
                    overrideBrowserslist: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
                  }]
                ]
              },
            },
          },
          'less-loader'
        ]
      },
      {
        test: require.resolve('zepto'),
        use: ['exports-loader?window.Zepto','script-loader']
      },
      {
        test: require.resolve('code-prettify'),
        use: ['exports-loader?window.PR','script-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './template/index.html',
      filename: './view/index.html',
      inlineSource: '.(js|css)$',
      chunks: ['main']
    }),
    // eslint-disable-next-line
    // @ts-ignore
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
  ]
};

export default config;
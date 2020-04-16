const path = require('path');
const WebpackPluginDefine = require("webpack").DefinePlugin;


module.exports = {
  entry: 'src/index.jsx',
  publicPath: './',
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
      themeConfig: {
        // 根据配置推导主品牌色
        primaryColor: '#00C4FF',
        // 覆盖 scss 原始变量
        'font-size-body-1': '14px',
      },
    }],
    ['ice-plugin-moment-locales', {
      locales: ['en-us'],
    }],
  ],
  alias: {
    '@': path.resolve(__dirname, './src/'),
  },
  chainWebpack: (config) => {
    config
      // 定义插件名称
      .plugin('WebpackPluginDefine')
      // 第一项为具体插件，第二项为插件参数
      .use(WebpackPluginDefine, [
        {
          QKC_JRPC: JSON.stringify(process.env.QKC_JRPC) || "'http://jrpc.devnet.quarkchain.io:38391'",
          QKC_EXPLORER: JSON.stringify(process.env.QKC_EXPLORER) || "'https://devnet.quarkchain.io/'",
        },
      ]);
  }
};

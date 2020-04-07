const path = require('path');

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
};

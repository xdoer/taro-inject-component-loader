export default {
  pages: ['pages/index/index'],
  subPackages: [
    {
      root: 'package-test',
      name: 'test',
      pages: ['pages/test/index'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}

export default {
  pages: [
    'pages/index/index',
    'pages/classa/index',
    'pages/classb/index',
    'pages/classc/index',
    'pages/functiona/index',
    'pages/functionb/index',
    'pages/functionc/index',
    'pages/arrowa/index',
    'pages/arrowb/index',
    'pages/connectclass/index',
    'pages/connectfunction/index',
    'pages/connectarrow/index',
  ],
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
    navigationBarTextStyle: 'black',
  },
}

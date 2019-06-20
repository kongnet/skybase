module.exports = {
  __swagger__: {
    name: 'demo接口',
    description: '用于展示如何定义一个接口'
  },
  '/demo/login': {
    name: 'demo接口1',
    desc: 'demo接口1',
    method: 'get',
    controller: 'demo.login',
    param: {
      account: {
        name: '账号',
        desc: '账号',
        req: 1,
        def: null,
        type: 'string'
      },
      password: {
        name: '密码',
        desc: '密码',
        req: 1,
        def: null,
        type: 'string'
      }
    },
    'token': false,
    'err_code': {},
    'test': {},
    'front': true
  },
  '/demo/home': {
    name: '测试token',
    desc: '测试token',
    method: 'get',
    controller: 'demo.home',
    param: { },
    'token': true,
    'err_code': {},
    'test': {},
    'front': true
  }
}

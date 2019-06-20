module.exports = {
  __swagger__: {
    name: 'demo接口',
    description: '用于展示如何定义一个接口'
  },
  '/demo/api1': {
    name: 'demo接口1',
    desc: 'demo接口1',
    method: 'get',
    controller: 'demo.api1',
    param: {
      name: {
        name: '你的名字',
        desc: '该接口将原封返回',
        req: 1,
        def: null,
        type: 'string'
      }
    },
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  }
}

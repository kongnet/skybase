module.exports = {
  __swagger__: {
    name: 'demo接口',
    description: '用于展示如何定义一个接口'
  },
  'api1': {
    name: 'demo接口1',
    desc: 'demo接口1',
    method: 'get',
    controller: 'dir/demo.api1',
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
    feqLimit: 1, // 每秒允许访问的次数
    'err_code': {},
    'test': {},
    'front': true
  }
}

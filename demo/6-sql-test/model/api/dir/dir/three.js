module.exports = {
  __swagger__: {
    name: '测试用例接口',
    description: '测试用例接口'
  },
  '/dir/dir/three': {
    name: 'demo接口1',
    desc: 'demo接口1',
    method: 'post',
    controller: 'test.three',
    param: {
      name: {
        name: '你的名字',
        desc: '你的名字',
        req: 0,
        def: '',
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

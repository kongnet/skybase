module.exports = {
  __swagger__: {
    name: '测试用例接口',
    description: '测试用例接口'
  },
  '/dir/two': {
    name: 'demo接口1',
    desc: 'demo接口1',
    method: 'post',
    controller: 'test.two',
    param: {
      name: {
        name: '你的名字',
        desc: '你的名字',
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

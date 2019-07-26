module.exports = {
  __swagger__: {
    name: '使用redis',
    description: '用于展示如何使用redis'
  },
  'api1': {
    name: '使用redis示例',
    desc: '',
    method: 'get',
    controller: 'use-redis.api1',
    param: {
      key: {
        name: 'key',
        desc: '',
        req: 1,
        def: null,
        type: 'string'
      },
      val: {
        name: 'val',
        desc: '',
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

module.exports = {
  __swagger__: {
    name: '使用rabbitmq',
    description: '用于展示如何使用rabbitmq'
  },
  'api1': {
    name: '往队列里插入数据',
    desc: '往队列里插入数据',
    method: 'get',
    controller: 'use-rabbitmq.api1',
    param: {
      msg: {
        name: '消息内容',
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

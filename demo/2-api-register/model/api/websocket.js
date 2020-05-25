module.exports = {
  __swagger__: {
    name: 'demo接口',
    description: '用于展示如何定义一个接口'
  },
  '/websocket/html': {
    name: '测试websocket的html页面',
    desc: 'demo接口1',
    method: 'get',
    controller: 'websocket.html',
    param: {},
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  }
}

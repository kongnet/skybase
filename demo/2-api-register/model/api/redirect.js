module.exports = {
  __swagger__: {
    name: '测试重定向',
    description: ''
  },
  'original': {
    name: '原地址',
    desc: '',
    method: 'get',
    controller: 'redirect.original',
    param: {},
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  },
  'to': {
    name: '重定向后实际访问的地址',
    desc: '',
    method: 'get',
    controller: 'redirect.to',
    param: {},
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  }
}

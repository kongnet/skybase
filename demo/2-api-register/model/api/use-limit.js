module.exports = {
  __swagger__: {
    name: '使用接口锁',
    description: ''
  },
  'lock': {
    name: '使用接口锁示例',
    desc: '',
    method: 'get',
    controller: 'use-limit.lock',
    limit: {
      singleLock: {
        code: 666,
        // msg: '前面有人在执行哦',
        expire: 6000
      }
    },
    param: {},
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  },
  'feqLimit': {
    name: '使用接口锁示例',
    desc: '',
    method: 'get',
    controller: 'use-limit.feqLimit',
    limit: {
      feqLimit: {
        timePerSecond: 1,
        code: 666,
        msg: '请慢点',
        expire: 6000
      }
    },
    param: {},
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  }
}

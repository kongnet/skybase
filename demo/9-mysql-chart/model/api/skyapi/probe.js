module.exports = {
  __swagger__: {
    name: '测试用例接口',
    description: '测试用例接口'
  },
  'mysql': {
    name: 'mysql探针数据',
    desc: 'mysql探针数据',
    method: 'get',
    controller: 'mysqlProbe.getTableColumnSize',
    param: {
      outputType: {
        name: '输出类型',
        desc: '接口输出html或者json',
        def: 'html',
        type: 'string'
      }
    },
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  },
  'mysqlTree': {
    name: 'mysql探针数据',
    desc: 'mysql探针数据',
    method: 'get',
    controller: 'mysqlProbe.getDbTable',
    param: {
      outputType: {
        name: '输出类型',
        desc: '接口输出html或者json',
        def: 'html',
        type: 'string'
      }
    },
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  },
  'mysqlGrid': {
    name: 'mysql探针数据',
    desc: 'mysql探针数据',
    method: 'get',
    controller: 'mysqlProbe.getDbTableColumn',
    param: {
      outputType: {
        name: '输出类型',
        desc: '接口输出html或者json',
        def: 'html',
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

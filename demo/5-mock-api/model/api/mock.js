/**
 * 测试mock数据内容
 * 参考网址 ： http://mockjs.com/examples.html
 * */

module.exports = {
  __swagger__: {
    name: 'mock数据接口',
    description: 'mock数据接口 - http://mockjs.com/examples.html'
  },
  '/mock/noControllerNoMock': {
    name: 'mock controller、mock 都没有',
    desc: 'mock controller、mock 都没有',
    method: 'get',
    // controller: 'mock.noController',
    param: {},
    err_code: {
      200: {
        temp: {
          'data': {},
          'code': 200,
          'msg': 'ok',
          't': 1552709427858
        }
      }
    },
    test: {},
    'token': false,
    'needSign': false,
    'front': true
  },
  '/mock/noController': {
    name: 'mock 没有controller',
    desc: 'mock 没有controller',
    method: 'all',
    // controller: 'mock.noController',
    param: {},
    mock: {
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      'list|1-2': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 100,
        'id1|0-21': 100,
        'name': '@genName',
        str: '@genData(\'abcdefghijklmnopqrstuvwxyz\',10)',
        datetime: '@genDatetime(\'2016-1-1\', \'2016-2-2\')',
        card: '@genCard',
        url: '@genUrl(5)',
        phoneNum: '@genPhone',
        color: '@genColor',
        colorRGBA: '@genColor(\'rgba\')',
        ip: '@genIp',
        word: '@genWord(10)',
        word0: '@genWord',
        sentence: '@genText(20)',
        sentence20: '@genText(20)',
        sentence10: '@genText(10)',
        sentence0: '@genText',
        constellation: '@genConstellation',
        bool: '@genBool',
        genEnum1: '@genEnum([\'5\',6,7])', // NOTICE key不能和函数名一样
        genEnum0: '@genEnum',
        genEnum2: '@genEnum([\'5x\',\'6x\',\'7x\'])',
        genEnum3: '@genEnum([[],null,\'\'])',
        img: '@genEnum([\'https://\',\'http://\'])resource.aijiatui.com/@genData(\'0123456789\',11)/company/moments/@genData(\'abcdefghijklmnopqrstuvwxyz0123456789\',32).jpeg',
        skuCode: null,
        'list|5-10': [
          /\d{5,10}/
        ]
      }]
    },
    err_code: {
      200: {
        temp: {
          'data': {},
          'code': 200,
          'msg': 'ok',
          't': 1552709427858
        }
      }
    },
    test: {},
    'token': false,
    'needSign': false,
    'front': true
  },
  '/mock/haveController': {
    name: 'mock 有controller',
    desc: 'mock 有controller',
    method: 'get',
    controller: 'mock.haveController',
    param: {},
    err_code: {
      200: {
        temp: {
          'data': { },
          'code': 0,
          'msg': 'ok',
          't': 1559204889719
        }
      }
    },
    test: {},
    'token': false,
    'needSign': false,
    'front': true
  },
  '/mock/image': {
    name: '各种图片数据模拟',
    desc: '各种图片数据模拟',
    method: 'get',
    controller: 'mock.image',
    param: {
      width: {
        desc: 'width',
        req: 0,
        def: 200,
        type: 'number',
        example: '200'
      },
      heigth: {
        desc: 'heigth',
        req: 0,
        def: 100,
        type: 'number',
        example: '100'
      },
      count: {
        desc: 'count',
        req: 0,
        def: 5,
        type: 'number',
        example: '5'
      },
      type: {
        desc: 'type [png,jpeg,jpg]',
        req: 0,
        def: 'png',
        type: 'string',
        example: 'png'
      }
    },
    err_code: {
      200: {
        temp: {
          'data': { },
          'code': 0,
          'msg': 'ok',
          't': 1559204889719
        }
      }
    },
    test: {},
    'token': false,
    'needSign': false,
    'front': true
  }
}

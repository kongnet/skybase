/**
 * 测试mock数据内容
 * 参考网址 ： http://mockjs.com/examples.html
 * */

module.exports = {
  __swagger__: {
    name: 'mock数据接口',
    description: 'mock数据接口 - 在mock基础上扩展了若干模拟函数'
  },
  'first': {
    name: '模拟函数返回测试',
    desc: '模拟函数返回测试支持get/post',
    method: 'all',
    controller: '',
    param: {},
    mock: {
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      'list|1-2': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 100,
        'name': '@genName()',
        str: '@genData(\'abcdefghijklmnopqrstuvwxyz\',10)',
        datetime: '@genDatetime(\'2016-1-1\', \'2020-1-1\')',
        chineseCard: '@genCard()',
        url: '@genUrl(5)',
        phoneNum: '@genPhone()',
        color: '@genColor()',
        colorRGBA: '@genColor(\'rgba\')',
        ip: '@genIp()',
        word10: '@genWord(10)',
        word1: '@genWord()',
        sentence20: '@genText()',
        sentence30: '@genText(30)',
        sentence10: '@genText(10)',
        sentence1000: '@genText(1000)',
        genBeautyText: '@genBeautyText()',
        constellation: '@genConstellation()',
        bool: '@genBool()',
        genEnum1: '@genEnum([\'5\',6,7])',
        genEnum2: '@genEnum([\'5x\',\'6x\',\'7x\'])',
        genEnum3: '@genEnum([[],null,\'\'])',
        img: '@genEnum([\'https://\',\'http://\'])resource.xxx.com/@genData(\'0123456789\',11)/company/moments/@genData(\'abcdefghijklmnopqrstuvwxyz0123456789\',32).jpeg',
        bingImg: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
        skuCode: /NO-\d{4}-\d{4}-\d{2}/,
        'list|5-10': [
          /\d{8,8}/
        ]
      }]
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

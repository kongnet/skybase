const sky = require('../../index')
const config = require('./config')

sky.start(config, async () => {
  console.log('Mock项目成功启动,我们可以使用全部mock函数，定义都在 meeko核心模块中')
  console.log($.c.g('https://github.com/kongnet/meeko'))
  let sNote = `
  genDatetime         随机日期
  genData             随机指定字符，和组成的长度
  genName             随机一个中文名字
  genCard             随机中国身份证
  genIp               随机IP地址
  genUrl              随机网址
  genPhone            随机3大运营商手机
  genColor            随机颜色，16进制和RGBA模式
  genWord             随机几个字
  genText             随机一段文字
  genConstellation    随机一个星座
  genBool             随机是否
  genEnum             随机指定的枚举值
  genBeautyText       随机一段优美的文字
  `
  console.log(sNote)
})

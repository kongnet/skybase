const fs = require('fs')

module.exports = {
  outProjectCode
}

async function outProjectCode (option) {
  for (let k in option.initModelsMap) {
    if (option.initModelsMap[k].codeConfig) { // 获取相应代码配置
      option.initModelsMap[k].codeConfig = option.initModelsMap[k].codeConfig()
    }
  }

  let fileTree = {
    config: {
      'index.js': getConfigIndex(),
      'config.default.js': getConfigDefault(option)
    },
    model: {
      api: {
        'demo.js': getModelApiDemo()
      }
    },
    router: {
      'demo.js': getRouterDemo()
    },
    'index.js': getIndex(option),
    'package.json': getPackage(option)
  }

  for (let k in option.initModelsMap) {
    await outPutFile(option.name, '', fileTree, option)
    if (option.initModelsMap[k] && option.initModelsMap[k].outFile) {
      // await option.initModelsMap[k].outFile(option.name, `${option.dirName}/../node_modules/skybase-${k}/`)
      await option.initModelsMap[k].outFile(option.name, `${option.dirName}/../../node_modules/skybase-${k}/`)
    }
  }
}

// package.json
function getPackage (option) {
  let file = {
    'name': option.name,
    'version': '1.0.0',
    'main': 'index.js',
    'dependencies': {
      skybase: '*'
    }
  }
  //   "amqplib": "^0.5.3",
  //   "skybase": "*"
  return JSON.stringify(file, '', ' ')
}

// index.js
function getIndex (option) {
  let addRequire = ''
  let addFunc = ''
  let addFuncCall = ''
  let addBeforeMount = ''
  let addCommon = {} // commonModelName --- bool

  for (let k in option.initModelsMap) {
    if (option.initModelsMap[k].codeConfig && option.initModelsMap[k].codeConfig.index) {
      addRequire += option.initModelsMap[k].codeConfig.index.require || ''
      addFunc += option.initModelsMap[k].codeConfig.index.func || ''
      addFuncCall += option.initModelsMap[k].codeConfig.index.funcCall || ''
      addBeforeMount += option.initModelsMap[k].codeConfig.index.beforeMount || ''
    }
    if (option.initModelsMap[k].codeConfig && option.initModelsMap[k].codeConfig.common) { // 增加公用模块
      for (let kk in option.initModelsMap[k].codeConfig.common) {
        if (!addCommon[kk] && option.initModelsMap[k].codeConfig.common[kk].index) {
          addRequire += option.initModelsMap[k].codeConfig.common[kk].index.require || ''
          addFunc += option.initModelsMap[k].codeConfig.common[kk].index.func || ''
          addFuncCall += option.initModelsMap[k].codeConfig.common[kk].index.funcCall || ''
          addBeforeMount += option.initModelsMap[k].codeConfig.common[kk].index.beforeMount || ''
          addCommon[kk] = true
        }
      }
    }
  }
  let file = `
const sky = require('skybase')
const config = require('./config')
const Pack = require('./package.json')
${addRequire}

/* global $ */

config.beforeMount = async () => {
    ${addBeforeMount}
}

sky.start(config, async () => {
    $.log('${option.name} 项目成功启动')
    ${addFuncCall}
})

${addFunc}
`
  return file
}

// 获取默认配置
function getConfigDefault (option) {
  let addFile = ''
  let addCommon = {} // commonModelName --- bool
  for (let k in option.initModelsMap) {
    if (option.initModelsMap[k].codeConfig) {
      addFile += option.initModelsMap[k].codeConfig.config || ''
      if (option.initModelsMap[k].codeConfig.common) { // 增加公用模块
        for (let kk in option.initModelsMap[k].codeConfig.common) {
          if (!addCommon[kk]) {
            addFile += option.initModelsMap[k].codeConfig.common[kk].config || ''
            addCommon[kk] = true
          }
        }
      }
    }
  }

  let file = `
const path = require('path')
const packageJson = require('../package')
module.exports = {
    ${addFile}
    name: packageJson.name,
    port: 8080,
    rootDir: path.join(__dirname, '../')
}`
  return file
}

// 获取 config/index.js 文档
function getConfigIndex () {
  let file = `
'use strict'
let $ = require('meeko')
const envMap = {
  dev: 'dev',
  development: 'dev',
  test: 'test',
  'local-test': 'local-test',
  checkout: 'checkout', // 是另一个测试环境，当时运维没命好名
  local: 'local',
  production: 'prod',
  prod: 'prod'
}

let env = process.env.NODE_ENV

// 有这个之后，启动时 node ./index.js local 即可指定环境
if (!env && process.argv[2]) {
  env = process.argv[2]
}

env = envMap[env] || 'local'
const defConfig = require('./config.default')

let config = {}
try {
  config = require('./config.' + env)
} catch (e) {
  console.log('\x1b[2;31m' + \`【普通错误】\${env}配置文件缺失，将使用default配置\` + '\x1b[m')
}
$.option.logTime = 0
$.log(\`=======================\n   NODE_ENV:\${$.c.g(\` \${env}  \`)}  \n=======================\`)
module.exports = { ...defConfig, ...config }
`
  return file
}

// 递归创建文档
async function outPutFile (dir, key, obj) {
  try {
    if (typeof obj === 'string') {
      // console.log(`创建目录  ${dir}`)
      await fs.mkdirSync(dir, { recursive: true })
      if (obj.length > 0) {
        await fs.writeFileSync(`${dir}/${key}`, obj)
      }
      return
    }
    for (let k in obj) {
      outPutFile(key === '' ? dir : `${dir}/${key}`, k, obj[k])
    }
  } catch (e) {
    console.error(e.stack)
  }
}

function getRouterDemo () {
  return `
const Mock = require('mockjs')

/* global $ */

module.exports = {
    async haveController (ctx) {
    ctx.ok({})
    }
}`
}

function getModelApiDemo () {
  return `
module.exports = {
    __swagger__: {
        name: 'mock数据接口',
        description: 'mock数据接口 - http://mockjs.com/examples.html'
    },
    '/demo/noControllerNoMock': {
        name: 'mock controller、mock 都没有',
        desc: 'mock controller、mock 都没有',
        method: 'get',
        // controller: 'demo.noController',
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
    '/demo/noController': {
        name: 'mock 没有controller',
        desc: 'mock 没有controller',
        method: 'all',
        // controller: 'demo.noController',
        param: {},
        mock: {
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'list|1-2': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 100,
            'id1|0-21': 100,
            'name': \`@genName\`,
            str: \`@genData('abcdefghijklmnopqrstuvwxyz', 10)\`,
            datetime: \`@genDatetime('2016-1-1', '2016-2-2')\`,
            card: \`@genCard\`,
            url: \`@genUrl(5)\`,
            phoneNum: \`@genPhone\`,
            color: \`@genColor\`,
            colorRGBA: \`@genColor('rgba')\`,
            ip: \`@genIp\`,
            word: '@genWord(10)',
            word0: '@genWord',
            sentence: \`@genText(20)\`,
            sentence20: \`@genText(20)\`,
            sentence10: \`@genText(10)\`,
            sentence0: \`@genText\`,
            constellation: \`@genConstellation\`,
            bool: \`@genBool\`,
            genEnum1: \`@genEnum(['5', 6, 7])\`, // NOTICE key不能和函数名一样
            genEnum0: \`@genEnum\`,
            genEnum2: \`@genEnum(['5x', '6x', '7x'])\`,
            genEnum3: \`@genEnum([[], null, ''])\`
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
    '/demo/haveController': {
        name: 'mock 有controller',
        desc: 'mock 有controller',
        method: 'get',
        controller: 'demo.haveController',
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
    }
}`
}

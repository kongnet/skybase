/**
 * @author: cuiguanghao
 * @date: 2019年06月10日08:37:23
 * @name: api.js
 * @description: 生成api文档
 */

const fs = require('fs')
const Config = require('../config')
/* global $ */

const apiDir = `${Config.fileApiDir}`
const allFileUpdateFlag = '__allUpdate' // 整个api更新
let memoryApiInfo = {} // 内存中存放的api更新详情数据，更新完成删除 filename -> {apiName : json}

module.exports = {
  list,
  info,
  update,
  output
}

// 返回当前目录中所有的 api 目录结构
async function list (arg) {
  if (arg.name.indexOf('..') >= 0) {
    return { code: 400, msg: `路径有误` }
  }

  let readDir = apiDir + arg.name + '/'
  let isExist = fs.existsSync(readDir) // 判断目录是否存在
  if (!isExist) {
    return { code: 400, msg: `当前路径不存在` }
  }
  let tmp = await fs.readdirSync(readDir) // 读取目录下 详情
  let list = []
  for (let i = 0; i < tmp.length; i++) {
    let fileName = readDir + tmp[i]
    let fStat = await fs.statSync(fileName)
    let isFile = fStat.isFile()
    list.push({ isFile, name: tmp[i] })
  }
  $.dir(list)
  return { code: 0, data: { nowPath: arg.name, list } }
}

async function info (arg) {
  if (arg.fileName.indexOf('..') >= 0) {
    return { code: 400, msg: `路径有误` }
  }
  // 获取某个接口详情
  let readFile = apiDir + arg.fileName
  let obj = null
  try {
    // 直接读取json文档
    let data = await fs.readFileSync(readFile)
    obj = JSON.parse(data.toString())
  } catch (error) {
    let ok = false
    try {
      // 读取 目前api文档
      obj = require(readFile)
      ok = true
    } catch (error) {
      $.err(error.stack)
    }
    if (!ok) {
      $.err(error.stack)
    }
  }
  if (obj) {
    if (arg.apiName && obj[arg.apiName]) { // 读取相应接口
      obj = obj[arg.apiName]
    }
    return { code: 0, data: obj }
  }

  return { code: 400, msg: `目录读取异常` }
}

async function update (arg) {
  if (arg.fileName.indexOf('..') >= 0) {
    return { code: 400, msg: `路径有误` }
  }

  // 检查json
  let obj = null
  try {
    obj = JSON.parse(arg.jsonStr)
  } catch (error) {
    $.err(error.stack)
    return { code: 400, msg: 'json格式错误' }
  }

  // 保存 JSON 参数
  if (!memoryApiInfo[arg.fileName]) {
    memoryApiInfo[arg.fileName] = {}
  }
  if (arg.apiName) {
    memoryApiInfo[arg.fileName][arg.apiName] = obj
  } else {
    obj[allFileUpdateFlag] = true
    memoryApiInfo[arg.fileName] = obj
  }
  $.dir(memoryApiInfo)
  return { code: 0 }
}

async function output (arg) {
  if (arg.fileName.indexOf('..') >= 0) {
    return { code: 400, msg: `路径有误` }
  }

  let writeFile = apiDir + arg.fileName

  // 写入的时候判断 是否存在目录  不存在创建目录
  let fileInfo = memoryApiInfo[arg.fileName]
  if (!fileInfo) {
    return { code: 400, msg: `${arg.fileName} 文档无更新` }
  }
  delete memoryApiInfo[arg.fileName]

  let createFlag = false
  if (fileInfo[allFileUpdateFlag]) { // 整个文档更新
    delete fileInfo[allFileUpdateFlag]
  } else { // 部分文档更新
    let tmp = await info({ fileName: arg.fileName })
    if (tmp.code !== 0) { // 从新创建目录和文档
      createFlag = true
    } else {
      fileInfo = { ...fileInfo, ...tmp.data }
    }
  }

  if (createFlag) { // 递归创建目录结构
    let l = arg.fileName.split('/')
    let tmpDir = apiDir
    for (let i = 0; i < l.length - 1; i++) {
      tmpDir += `/${l[i]}`
      let isExist = fs.existsSync(tmpDir) // 判断目录是否存在
      if (!isExist) {
        await fs.mkdirSync(tmpDir)
      }
    }
  }

  let fileStr = `module.exports = ${JSON.stringify(fileInfo, '', '  ')}`
  await fs.writeFileSync(writeFile, fileStr)
  return { code: 0 }
}

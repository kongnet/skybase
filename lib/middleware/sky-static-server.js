// NOTICE: 优先进入web容器
const $ = require('meeko')
const { rootDir, staticDir } = require('../../skyconfig')
const path = require('path')
const fs = require('fs')
const skyStaticServer = require('koa-static')
let wwwPath
if(staticDir){
  wwwPath = path.join(rootDir, staticDir)
  let isWwwExist = fs.existsSync(wwwPath)
  if (!isWwwExist) console.log($.c.y(`⚠️ ${wwwPath} 静态文件服务配置但目录不存在`))
} else{
  wwwPath = path.join(rootDir, './www')
  console.log($.c.y(`⚠️ 静态文件服务目录未配置 默认./www`))
}
module.exports = skyStaticServer(wwwPath)



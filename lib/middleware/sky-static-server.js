// NOTICE: 优先进入web容器
const $ = require('meeko')
const { rootDir, staticDir } = require('../../config')
const path = require('path')
const fs = require('fs')
const skyStaticServer = require('koa-static')

let wwwPath = path.join(rootDir, staticDir)
let isWwwExist = fs.existsSync(wwwPath)
if (!isWwwExist) console.log($.c.y(`⚠️  ${wwwPath} 静态文件服务器不存在`))
module.exports = skyStaticServer(wwwPath)

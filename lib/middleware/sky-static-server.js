// NOTICE: 优先进入web容器
const { rootDir, staticDir } = require('../../config')
const path = require('path')
const skyStaticServer = require('koa-static')
module.exports = skyStaticServer(path.join(rootDir, staticDir))


/* global $ */
const mysqlProbe = require('../service/mysqlProbe.js')
const fs = require('fs')
const path = require('path')
module.exports = {
  async getTableColumnSize (ctx) {
    const { outputType } = ctx.checkedData.data
    const r = await mysqlProbe.getTableColumnSize(ctx.checkedData.data)
    if (r && r.code === 0) {
      if (outputType === 'html') {
        let f = fs.readFileSync(path.join(__dirname, '../template/treemap-mysql.html'))
        let obj = {
          tableObjArr: [
            { title: '可读Mysql数据库各表行数',
              data: r.data.tableRow
            },
            { title: '可读Mysql数据库各表大小',
              data: r.data.tableSize
            }
          ]
        }
        ctx.type = 'html'
        ctx.body = $.tpl(f.toString()).render(obj)
      } else {
        ctx.ok(r)
      }
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  }
}

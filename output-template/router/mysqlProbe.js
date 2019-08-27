
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
  },
  async getDbTable (ctx) {
    let { outputType } = ctx.checkedData.data
    const r = await mysqlProbe.getDbTable(ctx.checkedData.data)
    if (r && r.code === 0) {
      // outputType = 'json' // 先写死
      if (outputType === 'html') {
        let f = fs.readFileSync(path.join(__dirname, '../template/tree-mysql.html'))
        let obj = {
          tableColumn: [{ name: 'root', children: r.data.tableColumn }],
          title: 'Mysql树形展示',
          len: r.data.len
        }
        ctx.type = 'html'
        ctx.body = $.tpl(f.toString()).render(obj)
      } else {
        ctx.ok(r)
      }
    } else {
      ctx.throwCode(r.code, r.msg)
    }
  },
  async getDbTableColumn (ctx) {
    let { outputType } = ctx.checkedData.data
    const r = await mysqlProbe.getDbTableColumn(ctx.checkedData.data)
    if (r && r.code === 0) {
      if (outputType === 'html') {
        let f = fs.readFileSync(path.join(__dirname, '../template/grid-mysql.html'))
        let packObj = $.tools.jsonPack(r.data)
        packObj.shift()
        let obj = {
          table_id: 'grid_mysql',
          table_title: 'Mysql数据库-表-字段',
          table_head: ['数据库', '表', '列', '列类型', '列注解'],
          table_col: [0, 1, 2, 3, 4],
          // table_col: ['dbName', 'tableName', 'columnName', 'columnKey', 'columnComment'],
          table_list: packObj
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

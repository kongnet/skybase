/* global db */
const Package = require('../package.json')

let sql = `select
  table_schema as 'dbName',
  table_name as 'tableName',
  table_rows as 'rowCount',
  truncate(data_length/1024/1024, 2) as 'dataSize',
  truncate(index_length/1024/1024, 2) as 'idxSize',
  table_comment as 'tableComment'
  from information_schema.tables
  order by data_length desc, index_length desc;`
let tableSql = `SELECT
  table_schema as db,
  table_name as table_name,
  table_comment as table_comment
  FROM
  information_schema.\`TABLES\`
  WHERE
  table_schema NOT IN ( 'information_schema', 'performance_schema', 'mysql', 'sys' );`
let columnSql = `SELECT
  table_schema AS db_name,
  table_name AS table_name,
  column_name AS column_name,
  column_type AS column_type,
  column_key AS column_key,
  column_comment AS column_comment
  FROM
  information_schema.\`COLUMNS\`
  WHERE
  table_schema NOT IN ( 'information_schema', 'performance_schema', 'mysql', 'sys' )
  ORDER BY table_schema;`
async function getTableColumnSize () {
  let r = await db.cmd(sql).run()
  let arr = []
  let arrSize = []
  let obj = {}
  r.forEach(item => {
    if (obj[item.dbName]) {
      arr[obj[item.dbName]].children.push({ name: item.tableComment + '\n' + item.tableName + '\n\n' + ((item.rowCount + '').toMoney(2)), value: item.rowCount || 0 })
      arrSize[obj[item.dbName]].children.push({ name: item.tableComment + '\n' + item.tableName + '\n\n' + ((item.dataSize + '').toMoney(2)), value: item.dataSize || 0 })
    } else {
      if (!['performance_schema', 'mysql', 'information_schema', 'sys', 'happyminer_test'].includes(item.dbName)) {
        arr.push({ name: item.dbName, children: [] })
        arrSize.push({ name: item.dbName, children: [] })
        obj[item.dbName] = arr.length - 1
      }
    }
  })
  arr.shift()
  // console.log(arr)
  return {
    code: 0,
    data: { tableRow: arr, tableSize: arrSize }
  }
}
async function getDbTable () {
  let r = await db.cmd(sql).run()
  let arr = []
  let obj = {}
  r.forEach(item => {
    if (obj[item.dbName]) {
      arr[obj[item.dbName]].children.push({ name: item.tableComment + ' ' + item.tableName })
    } else {
      if (!['performance_schema', 'mysql', 'information_schema', 'sys', 'happyminer_test'].includes(item.dbName)) {
        arr.push({ name: item.dbName, children: [] })
        obj[item.dbName] = arr.length - 1
      }
    }
  })
  arr.shift()
  return {
    code: 0,
    data: { tableColumn: arr, len: r.length }
  }
}
async function getDbTableColumn () {
  let r = await db.cmd(tableSql).run()
  let dbTableCommentMap = {}
  r.map(it => {
    dbTableCommentMap[[it.db, it.table_name].join('$$')] = it.table_comment.trim().replaceAll('\r\n', '')
  })
  r = await db.cmd(columnSql).run()
  r = r.map(it => {
    // console.log(dbTableCommentMap[it.db_name + '$$' + it.table_name])
    let emptyStr = it.column_name.includes('id') ? 'id' : ''
    return {
      dbName: it.db_name,
      tableName: it.table_name + ' ' + (dbTableCommentMap[it.db_name + '$$' + it.table_name] || '<font style="color:red">【无注解】</font>'),
      columnName: it.column_name,
      columnKey: it.column_key, // PRI->UNI->MUL
      columnComment: it.column_comment || emptyStr || '<font style="color:red">【空】</font>'
    }
  })
  return {
    code: 0,
    data: r
  }
}

getDbTableColumn()
module.exports = {
  getTableColumnSize,
  getDbTable,
  getDbTableColumn
}

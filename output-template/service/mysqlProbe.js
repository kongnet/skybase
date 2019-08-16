/* global db */
const Package = require('../package.json')

module.exports = {
  getTableColumnSize
}

async function getTableColumnSize () {
  let sql = `select
  table_schema as 'dbName',
  table_name as 'tableName',
  table_rows as 'rowCount',
  truncate(data_length/1024/1024, 2) as 'dataSize',
  truncate(index_length/1024/1024, 2) as 'idxSize',
  table_comment as 'tableComment'
  from information_schema.tables
  order by data_length desc, index_length desc;`
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

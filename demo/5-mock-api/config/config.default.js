const path = require('path')
const packageJson = require('../package')
module.exports = {
  name: packageJson.name,
  rootDir: path.join(__dirname, '../'),
  fileApiDir: path.join(__dirname, '../model/api/'),
  port: 8888
}

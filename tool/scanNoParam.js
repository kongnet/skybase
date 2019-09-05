let Mocha = require('mocha')
let path = require('path')
let $ = require('meeko')
let mocha = new Mocha({
  timeout:10000
})
mocha.addFile(path.join(__dirname, './mocha_api_test.js'))
mocha.run(function (failures) {
  process.exitCode = failures ? 1 : 0
})

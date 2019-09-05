{
  "name": "{{d.proName}}",
  "version": "{{d.proVersion}}",
  "description": "{{d.proDesc}}",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js",
    "test": "mocha ./tests/*.js",
    "testapi": "node ./tool/scanNoParam.js",
    "cz": "git add . && git status && git cz"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "amqplib": "^0.5.3",
    "ioredis": "^4.9.5",
    "j2sql": "^1.9.21",
    "kafka-node": "^4.1.3",
    "cz-jt": "*",
    "mock": "*",
    "skybase": "*",
    "meeko": "*",
    "standard": "^12.0.1"
  },
  "devDependencies": {
    "mocha": "^6.2.0"
  },
    "config": {
    "commitizen": {
      "path": "./node_modules/cz-jt"
    }
  }
}

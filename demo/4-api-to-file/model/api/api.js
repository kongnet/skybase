module.exports = {
  __swagger__: {
    name: 'api2file',
    description: '使用api json 生成 相应models/api'
  },
  '/api/list': {
    name: '获取所有接口列表',
    desc: '获取所有接口列表',
    method: 'get',
    controller: 'api.list',
    param: {
      name: {
        name: '读取路径',
        desc: '读取路径',
        req: 0,
        def: '.',
        type: 'string'
      }
    },
    'err_code': {
      200: {
        temp: {
          data: {
            nowPath: '.',
            list: [
              { isFile: true, name: 'README.md' },
              { isFile: false, name: 'config' },
              { isFile: true, name: 'index.js' },
              { isFile: false, name: 'model' },
              { isFile: false, name: 'model_back' },
              { isFile: true, name: 'package.json' },
              { isFile: false, name: 'router' },
              { isFile: false, name: 'service' }
            ]
          },
          code: 200,
          msg: '成功',
          t: 1560136820930
        }
      }
    },
    'test': {},
    'front': true
  },
  '/api/info': {
    name: '获取接口详情',
    desc: '获取接口详情',
    method: 'get',
    controller: 'api.info',
    param: {
      fileName: {
        name: '读取文件路径 + 文件名称',
        desc: '读取文件路径 + 文件名称',
        req: 1,
        def: null,
        type: 'string'
      },
      apiName: {
        name: '当前文档的 api name',
        desc: '当前文档的 api name',
        req: 0,
        def: '',
        type: 'string'
      }
    },
    'err_code': {
      200: {
        temp: {
          data: {
            name: '8apitofile',
            version: '1.0.0',
            description: '按照api json生成api文档目录结构和路由结构',
            main: 'index.js',
            scripts: {
              test: 'echo "Error: no test specified" && exit 1'
            },
            author: '',
            license: 'ISC',
            dependencies: {
              meeko: '^1.7.50'
            }
          },
          code: 200,
          msg: '成功',
          t: 1560136761788
        }
      }
    },
    'test': {},
    'front': true
  },
  '/api/update': {
    name: '单个api json更新到内存中',
    desc: '单个api json更新到内存中',
    method: 'post',
    controller: 'api.update',
    param: {
      fileName: {
        name: '读取文件路径 + 文件名称',
        desc: '读取文件路径 + 文件名称',
        req: 1,
        def: null,
        type: 'string'
      },
      apiName: {
        name: '当前文档的 api name',
        desc: '当前文档的 api name',
        req: 0,
        def: '',
        type: 'string'
      },
      jsonStr: {
        name: '相应api json文档',
        desc: '相应api json文档',
        req: 1,
        def: null,
        type: 'string'
      }
    },
    'err_code': {},
    'test': {},
    'front': true
  },
  '/api/output': {
    name: '更新api json到file中',
    desc: '更新api json到file中',
    method: 'get',
    controller: 'api.output',
    param: {
      fileName: {
        name: '读取文件路径 + 文件名称',
        desc: '读取文件路径 + 文件名称',
        req: 1,
        def: null,
        type: 'string'
      }
    },
    'err_code': {},
    'test': {},
    'front': true
  }
}

# skybase
Sky web base suit

## 安装 Install


    npm i skybase


## 开始你的web世界 Hello World

    const sky = require('skybase')
    
    sky.start({}, async () => {
      console.log('Program running...')
    })

## start(config, afterStart)

skybase只有一个方法

* config 配置
* afterStart 启动成功后执行的方法，可用async方法

## 配置

    const path = require('path')
    module.exports = {
    
      /**
       * 项目名称，启动时，会以3D字体的形式在控制台打印
       * */
      name: 'skybase',
    
      /**
       * 中间件
       * ps. 填写中间件的文件名（如果不填文件后缀，则认为是.js），自定义的中间件一定要放在项目根目录的 middleware 文件夹里，不然找不到。
       * ps. 中间件的加载顺序就是按照这个数组的顺序来的
       * ps. 如果自定义的中间件和框架自带的中间件重名，则优先使用自定义的
       * ps. koa2对中间件的使用是根据洋葱圈模型来设计的，写中间件之前，建议先看这篇文章了解洋葱圈模型 https://eggjs.org/zh-cn/intro/egg-and-koa.html
       * ps. 一定要在中间件中使用next，否则后续的中间件将不会执行
       *
       * 框架自带的中间件：
       * sky-cors --- 跨域允许
       * sky-body-parse --- 解析body，可以解析各种方式的body，甚至可以接收文件
       * sky-static-server --- 静态文件服务器，一般是开发环境需要，生产环境的前端一般不会让后端代理
       * koaLogger --- 使用koa-logger，功能太少，现在已经不用它了，改用孔哥自制的
       * sky-check-param --- 检查参数，根据 /models/api/ 下的api定义来检查参数
       * output --- 记录api操作日志
       * apiRegister --- 注册api，要在以上两个之后注册，因为以上两个要记录api的执行时间。一般这个都放在数组最后，因为api不会再next后续的中间件了
       * */
      middlewares: [
        'sky-cors',
        'sky-body-parse',
        'sky-static-server',
        'sky-check-param',
        'sky-check-token',
        'sky-output',
        'sky-api-register'
      ],
    
      /**
       * token 保存key值
       * */
      tokenName: 'skybase',
    
      /**
       * 入口文件的路径
       *
       * 如果不填，或者转为布尔值为false，则使用 path.dirname(process.mainModule.filename) ，即本node应用的入口文件所在目录
       * */
      rootDir: path.dirname(process.mainModule.filename),
    
      /**
       * api定义所在目录
       *
       * 如果 middlewares 中有 sky-api-register ，此项必填
       *
       * 填写相对于 rootDir 的相对路径
       * */
      apiDir: './model/api',
    
      /**
       * 控制器所在目录
       *
       * 如果 middlewares 中有 sky-api-register ，此项必填
       *
       * 填写相对于 rootDir 的相对路径
       * */
      routerDir: './router',
    
      /**
       * service所在目录
       *
       * 框架会自动加载service，并为每个service指定一个固定的错误码，当该service发生错误时，会打印该错误码
       * 如果不要该功能，把此配置设为空即可
       *
       * 填写相对于 rootDir 的相对路径
       * */
      serviceDir: '',
    
      /**
       * 是否打印日志
       * */
      logger: true,
    
      /**
       * 自定义中间件所在目录
       *
       * 如果要用中间件，除了把中间件放在这个目录下，还要在 middlewares 中填写中间件名称
       *
       * 填写相对于 rootDir 的相对路径
       * */
      middlewareDir: './middleware',
    
      /**
       * 静态服务的路径
       *
       * 如果 middlewares 中有 sky-static-server ，此项必填
       *
       * 填写相对于 rootDir 的相对路径
       * */
      staticDir: './www',
    
      /**
       * 限制post来的数据，这个配置将在 sky/middleware/bodyParse.js 中使用
       */
      bodyParse: {
        multipart: !0,
        formLimit: '100mb', // 100M 文件上传限制
        jsonLimit: '2mb', // body中json格式大小限制
        textLimit: '2mb', //
        extendTypes: {
          custom: [
            'text/xml'
          ]
        }
      }
    }

## api 定义

skybase框架的api定义功能主要有以下几点：

1. 指定api所需参数，会自动校验参数是否符合设定
2. 输出api接口文档，前端同学可直观查看
3. 指定接口的访问权限。如是否登录，是否签名，登录者是否拥有指定权限


    module.exports = {
      __swagger__: { // 用于把此文件内的接口归为同一组的组名
        name: '文章库-文章管理',
        description: '增删改查等'
      },
      '/article/create': { // key 为接口地址
        'name': '文章-创建',
        'desc': '创建一篇文章',
        'method': 'post',
        controller: 'article.create',
        param: {
          title: {
            name: '文章标题',
            desc: '不支持html语义',
            req: 1,
            def: null,
            type: 'string',
            size: [1, 400]
          }
        },
        'token': true,
        'needSign': false,
        'err_code': {
          200: {
            type: 'object',
            description: '',
            properties: {
              sid: {
                type: 'string',
                description: '新建的文章sid'
              }
            }
          }
        },
        'test': {},
        'front': true,
        'permission': 101
      }
    }


**接口地址**： 

* 如果以 / 开始，接口路径则完全等于所编写的地址
* 否则接口路径的规则为：

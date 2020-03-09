# skybase 最佳实践

## 概述

- 200+的项目使用过，内部框架
- 最高使用在单机日访问 2000 万 PV 应用上
- 并不精细，想保留更大的自由度

## 安装

- npm i -g yarn // 全局安装 另一个包管理模块
- npm i -g nodemon // 全局安装后端调试工具
- npm i -g skyjt //jt 命令行工具
- jt init -f // 初始化一个 skybase 项目 -f 强制覆盖已有目录 ，根据提示完成

  > 以上完成对 skybase 的一个模板例子的拉取并初始化，完成后会带有几个基础例子，方便入门

## 配置

- cd 进入刚才建立的目录
- yarn or npm i

  > 以上操作会保持最新的 skybase 和 meeko 基础库

- 打开 config 目录，目录中包括各个环境的配置文件，以及一个 default 的默认文件，在无法确认环境变量 NODE_ENV 时，会取这个文件配置
- 打开 config.default.js 修改 mysql 配置 和 redis 配置，用户名、密码、默认数据库。可使用 docker 安装此 2 个服务
- 命令行回到项目根目录 cd ..
- nodemon // 启动默认例子
- nodemon index_stat //启动统计例子 含基础例子，需要配置 redis,数据表增删改成扩展等,占位符展等 例子

## 开发流程

### 理解工程文件目录结构

- config 不同环境的配置
- middleware koa2 中间件目录，洋葱皮模式，但不建议同时超过 20 个使用，性能下降较大
- model 业务基础类和 api 定义放在此处，skyapi 目录保留，作为 skybase 的扩展业务模块目录
- router api 路由目录
- service 业务路由抽象类层，对应每个路由有一个 service
- template 模板文件 {{ }} 为开闭符，一般用来填充数据推出 html 页面
- tool 一些工具
- xxx_index.js 一般为服务器入口文件
- .editorconfig 编辑风格
- .eslintignore eslint 忽略扫描
- .gitignore git 忽略
- .gitlab-ci.yml gitlab 自动化 CI 文件
- .istanbul.yml 覆盖率配置
- README.md

### 开始开发，自有案例

#### 前端 mock 服务器

> 开发中需要在，后端没有好之前前端可调，并和后端商量接口字段

- 打开 model/api/mock.js ,查看 first 属性
- controller:'' 代表次接口没有控制器，控制器就是 router 下对应的文件
- mock:{} 代表需要直接浏览器访问此接口时候的模拟返回 json 配置
- mock 基本语法同 mock.js 在此基础上扩展了 12 个 函数，'@函数(参数)'调用，详见 model/api/mock.js 17-50
- 命令行下 nodemon ，打开浏览器 输入 http://127.0.0.1:13000/skyapi/mock/first // 查看 mock 例子。 ctrl+c 退出
- api 定义的名字 同最终的访问路径关系有 2 种，类似上面的 first 接口，因为在 api/skyapi/mock.js 中 所以路径最终为域名**/skyapi/api 文件名/属性名**。 另 1 种 是 ‘/first’:{} 带有 **‘/’** 作为属性开头，那就是绝对地址，**域名/first**访问
- 完成此功能需要有 model/api/mock.js （mock api 配置文件）

#### 简单 API

##### 最简单的 api 例子

- 打开查看 model/api/mock.js ,getEmpty 属性

```javascript
  getEmpty: {
    name: 'getEmpty',
    desc: 'getEmpty',
    method: 'get', //get模式可在浏览器中直接看到结果 请安装chrome的jsonview插件
    controller: 'mock/easy.getEmpty', // 对应./router/mock/easy.js 中的getEmpty方法，打开看一下，一句ctx.ok('返回正常')
    param: {}, //无qs（地址栏）参数。 qs form header http协议不同位置
    test: {},
    token: false,
    needSign: false,
    front: true
  }
```

- 命令行 nodemon 或者 已启动 不用再运行
- http://127.0.0.1:13000/skyapi/mock/getEmpty // 最简单的 api 例子

##### 返回 html 页面的 api

- 打开查看 model/api/mock.js ,**getHtml**属性
- 对应./router/mock/easy.js 中的**getHtml**方法，注意有 ctx.type='html' mime 值设置
- 同上操作
- http://127.0.0.1:13000/skyapi/mock/getHtml // 查看 mock 例子

##### 获取一个网页内容，并返回在一个 html 页面的 pre 标签中

- 打开查看 model/api/mock.js ,**getUrl**属性
- param:{url:{...}} 此处拥有一个 url 的参数，设置默认值 def 为'http://www.baidu.com'
- 对应./router/mock/easy.js 中的**getUrl**方法，注意有 await req(url)
- 同上操作
- http://127.0.0.1:13000/skyapi/mock/getUrl?url=http://www.baidu.com // 获取 url 代码和内容，不提交 url 参数，默认拉取 baidu 首页

##### 通过 api 获取 bing 的今日背景图

- 打开查看 model/api/mock.js ,**getBing**属性
- param 无参数
- 对应./router/mock/easy.js 中的**getBing**方法，注意有 await req(..)
- 直接获取 bing api，解析 json 结构后 返回到一个 嵌入一个 img 标签的 html 页面
- http://127.0.0.1:13000/skyapi/mock/getBing // 获取 bing 最新的背景图

##### 通过 api 返回一个 图片占位符，mock 中常用到

- http://127.0.0.1:13000/skyapi/mock/img?size=100x100 // 返回占位符互补色例子
- 通过对上面文件结构的理解，自行查看

##### 通过 api 返回一个 验证码，但要注意写入一个超时，限制验证码时效

- http://127.0.0.1:13000/skyapi/mock/captcha
- 通过对上面文件结构的理解，自行查看

##### 通过 api 返回一个 html 二维码

- http://127.0.0.1:13000/skyapi/mock/qrcode?str=
- 通过对上面文件结构的理解，自行查看

##### needSign 验签接口

- http://127.0.0.1:13000/skyapi/mock/getSign?t=xxx&sign=xxx，启动nodemon index_stat
- 当 api 定义中 needSign 为 1 时，启用验签
- 例子在 ./middleware/sample_middleware.js 中
- 用户可自定义验签的函数
- t 代表时间整型，
- 所有参数，除 sign（一般不在验签的列中），按字母升序后，进行验签，验签不通过，直接返回错误
- 一般验签中间件放在，其他中间前面看./skyconfig.js 配置文件

#### 复杂 API

##### 文件上传

> 项目中一般都有文件上传

- 打开 model/api/mock.js, 找到 upload 属性，api 定义 type:file。 size 数组代表最大最小长度单位 byte。 fileType 数组，mime 形式的允许上传文件
- 对应./router/mock/upload.js，69 行 demo 函数，引用 uploadRule 中的 demo 规则，这边 allowType 和 size 写死了，也可以联动到 api 定义中。
- 注意：api 定义中是 fileType，router 中是 allowType，历史原因
- path 是相对 upload 上传目录的目录，例子中是 demo
- nameRule 是每次上传的文件名称，一般由分类+时间+随机组成，例子中是 18 位长的随机字符串

##### web 中间件

> 当访问过来的时候会通过内置中间件和自定义中间件，接住上下文后做进一步处理

- http://127.0.0.1:13000/skyapi/use-limit/lock // 运行接口时加锁，运行完解锁，超时也会解锁
- http://127.0.0.1:13000/skyapi/use-limit/feqLimit // 根据接口访问频率控制
- 中间件的位置在 ./middleware/limit.js

#### 小结

- 1.首先增加 api 定义
- 2.是 mock 接口就直接，在定义的 mock 字段中增加，controller 为空字符串
- 3.不是 mock 接口就指明 controller 字符串，并在 router 中增加相应的，文件和方法
- 4.复杂业务就放到 service 中，router 文件中 ，引用使用
- 5.文件上传
- 6.web 中间件

### 理解 API 定义（参数检查，表单验证。。）

> 大部分的时候我们对提交的参数会有限制，我们将各类限制的规则提取出来，并与 API 的定义组合形成一套 skybase 的 api 定义 json 格式

#### api 定义文件

- 打开 ./model/api/skyapi/sky-stat.js
- 看 getOne，这是一个获取统计系统中某个特定键值序列的接口

```javascript
'getOne': { // 接口的属性
    name: '获取单个统计', // 接口名称
    desc: '获取指定api 5m 24个点，1h 24个点,1d 30个点',// 接口详细说明
    method: 'get, // 提交的方式 get post all-get/post
    controller: 'sky-stat/stat.getOne', // 控制器，router方法所在的文件位置
    param: { // 参数
        api: { // 参数名
          name: 'api名称',
          desc: '指定api名称  例： _test',
          req: 1, // 是否必填，0或者不写或null，忽略必填
          def: null, // 是否有默认值，null或者不写，没有默认值，注意如果数值型 输入为0 还是 0
          type: 'string'
        // 参数的类型 int positive negative file文件 string
        // datetime YYYY-MM-DD hh:mm:ss
        // enum是个数组 具体指写在size属性中size:[1,2,3] or size:['open'，'close'],type:enum
        // file类型 有size允许文件长度，fileType允许文件类型，2者都是数组形式
        // bool number array不常用
        },
        type: {// 这是另一个参数
          name: '输出类型 [api-输出输出 mix-html输出 chart-html只有图表]',
          desc: '直接输出html界面',
          req: 0,
          def: 'api',
          type: 'string'
        }
    },
    'token': false, // true会检测http header中是否有token，并可进入验证token是否正确
    'needSign': false, // true会要求提交参数需要有sign验证，算法自定义
    'err_code': {},
    'test': {},
    'front': true
  }
```

- controller: 'sky-stat/stat.getOne'，表示 router 对应的文件 是 ./router/sky-stat/stat.js 中的 getOne 方法
- name 接口名称，desc 注明接口详情，此属性会在之后的生成 api 文档清晰说明接口定义
- api 定义后，访问如果不满足条件，将会被挡在 router 处理层外
- 打开./router/sky-stat/stat.js ,查看 getOne 方法
- const r = await skyapiService.getOne(ctx.checkedData.data) 其中 ctx.checkedData.data 如果通过即为已经被 api 规则通过的 结果，不通过，router 层之前返回错误

#### api 定义文件生成

- ./tools/api2swagger.js 每次 CI 时 将遍历 api 定义，转成 swaager 格式的 json 形式，可以导入 postman 进行操作。默认生成目录在 ./www/swagger
- ./tools/api2markdown.js 每次 CI 是 将遍历 api 定义，生成 api 说明文档。默认生成目录在 ./www/markdown

#### 小结

- api 定义，包括 mock 定义，有全栈研发发起，快速分解需求的方式，和产品说定义具体实现，由你来
- api 的规则被定义在 meeko 组件 npm i meeko 的 meeko.tools.checkParam，因为历史原因，这是一个写的并不好的函数，但有足够的代码覆盖率

### 复杂例子

> 最终实现业务逻辑，离不开 mysql redis mq 等操作
> http://127.0.0.1:13000/skyapi/probe/mysql // 查看探针例子 这里 treemap 的例子可能会出不来，是因为 地图的 key 是个人的，过期的原因 ./template/treemap-mysql.html
> 如果直接看不懂，我们之后回过头来再看![](https://raw.githubusercontent.com/kongnet/skybase/master/screenShot/demo9.png)

#### mysql 操作

##### 概述

- npm i j2sql2 安装 skybase 配套的 mysql 操作组件
- j2sql2 设计核心是为了，可以简单操作 mysql 并 可以表的操作进行一些统一的扩展而设计的
- 打开 ./index_stat.js 看 9-13 行

```javascript
const skyDB = new SkyDB({ mysql: config.mysql, redis: config.redis })
const db = await skyDB.mysql // 创建mysql实例
const rd = await skyDB.redis // 创建redis 实例
global.db = db
global.redis = rd
```

- skyDB 整合了 mysql 的加载和 redis 的加载,如果 mysql 没有连接会报错，如果 mysql 数据库的表为 0 也会报错，具体的配置 查看 ./config/config.**您的环境 or default**.js ，兼容 node-mysql

##### j2sql 和 j2sql2 的关系

- j2sql 带有 genrator yield 操作的兼容 j2sql2 直接 promise await 模式并合并了 redis 操作

##### j2sql2 基本操作

- db 是一个 skyDB.mysql 的实例
- db.**表名**.[C or U or R or D](对应的操作)
- https://github.com/kongnet/j2sql/tree/master/tests j2sql 的测试用例，j2sql2 操作同 j2sql
- 如果想更快捷，使用 await db.cmd(**sqlStr**) sqlStr 强烈建议 使用 preSql 模式，防止注入

```javascript
console.log('sql算式', await db.run('select ?+? as sum', [3, 2])) // 建议使用方式 db.run(preSQL模式)
```

- 使用 db.**表名**.[C or U or R or D] 操作模式，如果表名，列名 不存在，会直接报错而不进行 IO 操作
- db.**表名**.ex.[list({}) page({}) getById(n) 。。。] 对表对象扩展了 可打印 db.表名.ex 查看

##### mysql 复杂操作（事务操作）

> 比如，插入一条记录，上传七牛云，但上传失败，此时使用事务来回滚，插入的记录回还原

- 请使用 await db.cmd(sqlStr).run() [兼容 j2sql] or await db.run(sqlStr)

```javascript
let conn = await db.pool.getConnection() // 取一个链接实例
await conn.beginTransaction() //开始事务标记
try {
  let c = 100000
  console.time('10w')
  while (c--) {
    await conn.query(
      `insert into t3 (pid,uid,amount,c_time) values (?,?,?,?)`,
      [2, 1, Math.floor(10000 * Math.random()), new Date()]
    )
  } // 对t3表插入10万条
  // do something , error await conn.rollback() 做其他事情发生错误，回滚
  await conn.commit() // 主动提交
  console.timeEnd('10w')
} catch (e) {
  console.error(e)
  await conn.rollback() // 如果sql发生错误，回滚10w条数据
}
await conn.release()
```

#### redis 操作

##### 概述

- io-redis 封装，支持所有 io-redis 可支持的操作

```javascript
const rd = await skyDB.redis // 创建redis 实例
console.log('check key off', rd.keysLimit.add('*')) // 关闭redis检验,或者配置Config.redis
console.log('设置j2sql2_test', await rd.set('j2sql2_test', '1'))
console.log('获取j2sql2_test', await rd.get('j2sql2_test'))
console.log('删除j2sql2_test', await rd.del('j2sql2_test'))
console.log('获取j2sql2_test', await rd.get('j2sql2_test'))
```

- 以上代码在 async 函数中 运行
- 例子查看 https://github.com/kongnet/j2sql2/blob/master/sample.js

##### redis 键值的控制

> 在开发时因为有很多的 key-value 对，容易遗忘，因此 j2sql2 扩展了 redis 的限制

- 在 config redis 字段中 增加

* keyLimit: ['x1', 'c*'] //

```javascript
const redisObj = {
  host: '127.0.0.1',
  port: 32769,
  auth: '',
  db: 0,
  // 如果有此字段就会对，有key的操作的命令进行过滤,排序后判断，有限先满足带*号的规则，再满足普通规则
  keyLimit: ['x1', 'c*'] // '*' 全部允许
}
```

- rd.keysLimit.add('\*') 关闭所有限制
- rd.keysLimit.status = 1 or rd.keysLimit.del('\*') 打开 限制
- 打开后 await rd.get('k1') **报错**

#### rabbitMQ 操作

##### 概述

> 增加 rabbitMQ 目的是为了解耦业务逻辑，削峰填谷.

##### rabbitMQ 的安装

- 使用 docker 安装
- 默认 guest/guest 登陆 http://localhost:15672/#/
- 如果发现用户密码不对的 docker 镜像，可以登陆 docker 使用如下命令
- rabbitmqctl list_users 列出所有用户
- rabbitmqctl add_user username 添加用户，输入密码
- rabbitmqctl change_password username newpasswd 修改用户密码
- http://localhost:15672/#/ 本地登陆管理后台

##### skybase 的 MQ 例子

- index_mq_stat.js 生产者

```javascript
const skyDB = new SkyDB({
  mysql: config.mysql,
  redis: config.redis,
  rabbitMQ: config.rabbitMQ
})
const db = await skyDB.mysql // 创建mysql实例
const rd = await skyDB.redis // 创建redis 实例
const rabbitMQ = await skyDB.rabbitMQ // 创建mq 实例
global.db = db
global.redis = rd
global.rtsMQ = rabbitMQ // 此处注意rtsMQ不为空，skybase自动启动此对象对应的MQ实例
```

- 正确配置 rabbitMQ 后，nodemon index_mq_stat.js ，MQ 链接正确后会答应 队列名和消息总数
- 查看 api 统计总表，http://127.0.0.1:13000/skyapi/sky-stat/getAll?type=mix
- ab 压力测试后，再次查看，发现统计未变化

- rts_consumer.js 消费者
- 生产者将统计打到 mq，启动消费者 nodemon rts_consumer.js
- 稍后 查看http://127.0.0.1:13000/skyapi/sky-stat/getAll?type=mix，统计值发生变化，为正确

##### 错误快速排查

- 路由 router 层+业务 service 层的错误，将被写入\$G.errorList 中，保留最近 20 条
- 可以创建一个 错误查询接口 来返回此对象 ctx.ok(\$G.errorList)
- 注意这里的列表是单进程的，没有持久化，启动后即清空

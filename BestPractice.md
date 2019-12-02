# skybase最佳实践

## 概述
* 200+的项目使用过，内部框架
* 最高使用在单机日访问2000万 PV应用上
* 并不精细，想保留更大的自由度大

## 安装
* npm i -g yarn // 全局安装 另一个包管理模块
* npm i -g nodemon // 全局安装后端调试工具
* npm i -g skyjt //jt 命令行工具
* jt init // 初始化一个skybase项目 -f 强制覆盖已有目录 ，根据提示完成
> 以上完成对skybase的一个模板例子的拉取并初始化，完成后会带有几个基础例子，方便入门

## 配置
* cd 进入刚才建立的目录
* yarn or npm i
> 以上操作会保持最新的skybase和meeko基础库

* 打开congig目录，目录中包括各个环境的配置文件，以及一个default的默认文件，在无法确认环境变量NODE_ENV时，会取这个文件配置
* 打开config.default.js 修改mysql配置 和 redis 配置，用户名、密码、默认数据库。可使用docker安装此2个服务
* 命令行回到项目根目录 cd ..
* nodemon // 启动默认例子
* nodemo index_stat //启动统计例子 含基础例子，需要配置redis,数据表增删改成扩展等,占位符展等 例子


## 开发流程
### 理解工程文件目录结构
* config 不同环境的配置
* middleware koa2中间件目录，洋葱皮模式，但不建议同时超过20个使用，性能下降较大
* model 业务基础类和api定义放在此处，skyapi目录保留，作为skybase的扩展业务模块目录
* router api路由目录
* service 业务路由抽象类层，对应每个路由有一个service
* template 模板文件 {{ }} 为开闭符，一般用来填充数据推出html页面
* tool 一些工具
* xxx_index.js 一般为服务器入口文件
* .editorconfig 编辑风格
* .eslintignore eslint忽略扫描
* .gitignore git忽略
* .gitlab-ci.yml gitlab自动化CI文件
* .istanbul.yml 覆盖率配置
* README.md
### 开始开发，自有案例
#### 前端mock服务器
>开发中需要在，后端没有好之前前端可调，并和后端商量接口字段
* 打开 model/api/mock.js ,查看first属性
* controller:'' 代表次接口没有控制器，控制器就是router下对应的文件
* mock:{} 代表需要直接浏览器访问此接口时候的模拟返回json配置
* mock基本语法同mock.js 在此基础上扩展了12个 函数，'@函数(参数)'调用，详见model/api/mock.js 17-50
* 命令行下nodemon ，打开浏览器 输入   http://127.0.0.1:13000/skyapi/mock/first  // 查看mock例子。 ctrl+c退出
* api定义的名字 同最终的访问路径关系有2种，类似上面的first接口，因为在api/skyapi/mock.js中 所以路径最终为域名**/skyapi/api文件名/属性名**。 另1种 是 ‘/first’:{} 带有  **‘/’** 作为属性开头，那就是绝对地址，**域名/first**访问
* 完成此功能需要有model/api/mock.js （mock api 配置文件）

####  最简单的api例子
* 打开查看 model/api/mock.js ,getEmpty属性
``` javascript
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
* 命令行nodemon 或者 已启动 不用再运行
* http://127.0.0.1:13000/skyapi/mock/getEmpty  // 最简单的api例子
#### 返回html页面的api

* 打开查看 model/api/mock.js ,**getHtml**属性
* 对应./router/mock/easy.js 中的**getHtml**方法，注意有 ctx.type='html' mime值设置
* 同上操作
* http://127.0.0.1:13000/skyapi/mock/getHtml  // 查看mock例子
#### 获取一个网页内容，并返回在一个html页面的pre标签中

* 打开查看 model/api/mock.js ,**getUrl**属性
* param:{url:{...}} 此处拥有一个url的参数，设置默认值def为'http://www.baidu.com'
* 对应./router/mock/easy.js 中的**getUrl**方法，注意有 await req(url)
* 同上操作
* http://127.0.0.1:13000/skyapi/mock/getUrl?url=http://www.baidu.com // 获取url代码和内容，不提交url参数，默认拉取baidu首页

#### 通过api获取bing的今日背景图
* 打开查看 model/api/mock.js ,**getBing**属性
* param 无参数
* 对应./router/mock/easy.js 中的**getBing**方法，注意有 await req(..)
* 直接获取bing api，解析json结构后 返回到一个 嵌入一个img标签的html页面
* http://127.0.0.1:13000/skyapi/mock/getBing // 获取bing最新的背景图

#### 通过api返回一个 图片占位符，mock中常用到
* http://127.0.0.1:13000/skyapi/mock/img?size=100x100  // 返回占位符互补色例子
* 通过对上面文件结构的理解，自行查看

#### 小结
* 1.首先增加api定义
* 2.是mock接口就直接，在定义的mock字段中增加，controller为空字符串
* 3.不是mock接口就指明controller字符串，并在router中增加相应的，文件和方法
* 4.复杂业务就放到service中，router文件中 ，引用使用

### 理解API定义（参数检查，表单验证。。）
> 大部分的时候我们对提交的参数会有限制，我们将各类限制的规则提取出来，并与API的定义组合形成一套skybase的api定义json格式

#### api定义文件
* 打开 ./model/api/skyapi/sky-stat.js
* 看getOne，这是一个获取统计系统中某个特定键值序列的接口
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
        type: 'string'// 参数的类型 int positive negative string 
        // datetime YYYY-MM-DD hh:mm:ss 
        // enum是个数组 具体指写在size属性中size:[1,2,3] or size:['open'，'close'],type:enum 
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
    'token': false,
    'needSign': false,
    'err_code': {},
    'test': {},
    'front': true
  }
```
* controller: 'sky-stat/stat.getOne'，表示router对应的文件 是 ./router/sky-stat/stat.js 中的 getOne方法
* name 接口名称，desc 注明接口详情，此属性会在之后的生成api文档清晰说明接口定义
* api定义后，访问如果不满足条件，将会被挡在router处理层外
* 打开./router/sky-stat/stat.js ,查看 getOne方法
* const r = await skyapiService.getOne(ctx.checkedData.data) 其中 ctx.checkedData.data 如果通过即为已经被api规则通过的 结果，不通过，router层之前返回错误

#### api定义文件生成
* ./tools/api2swagger.js 每次CI时 将遍历api定义，转成swaager格式的json形式，可以导入postman进行操作。默认生成目录在 ./www/swagger
* ./tools/api2markdown.js 每次CI是 将遍历api定义，生成api说明文档。默认生成目录在 ./www/markdown
#### 小结
* api定义，包括mock定义，有全栈研发发起，快速分解需求的方式，和产品说定义具体实现，由你来
* api的规则被定义在 meeko 组件npm i  meeko 的meeko.tools.checkParam，因为历史原因，这是一个写的并不好的函数，但有足够的代码覆盖率 
### 复杂例子
> 最终实现业务逻辑，离不开mysql redis mq等操作
> http://127.0.0.1:13000/skyapi/probe/mysql  // 查看探针例子 这里treemap的例子可能会出不来，是因为 地图的key是个人的，过期的原因 ./template/treemap-mysql.html
> 如果直接看不懂，我们之后回过头来再看![](https://raw.githubusercontent.com/kongnet/skybase/master/screenShot/demo9.png)

#### mysql操作
##### 概述
* npm i j2sql2 安装skybase配套的mysql操作组件
* j2sql2 设计核心是为了，可以简单操作mysql 并 可以表的操作进行一些统一的扩展而设计的
* 打开 ./index_stat.js 看 9-13行
```javascript
  const skyDB = new SkyDB({ mysql: config.mysql, redis: config.redis })
  const db = await skyDB.mysql // 创建mysql实例
  const rd = await skyDB.redis // 创建redis 实例
  global.db = db
  global.redis = rd
```
* skyDB整合了mysql的加载和redis的加载,如果mysql没有连接会报错，如果mysql数据库的表为0 也会报错，具体的配置 查看 ./config/config.**您的环境 or default**.js ，兼容node-mysql
##### j2sql  和 j2sql2的关系
* j2sql带有 genrator yield 操作的兼容 j2sql2 直接 promise await模式并合并了redis操作
##### j2sql2基本操作
* db是一个skyDB.mysql的实例
* db.**表名**.[C or U or R or D](对应的操作) 
* https://github.com/kongnet/j2sql/tree/master/tests  j2sql的测试用例，j2sql2 操作同j2sql
* 如果想更快捷，使用  await db.cmd(**sqlStr**) sqlStr强烈建议 使用 preSql模式，防止注入
```javascript
console.log('sql算式', await db.run('select ?+? as sum', [3, 2])) // 建议使用方式 db.run(preSQL模式)
```
* 使用 db.**表名**.[C or U or R or D] 操作模式，如果表名，列名 不存在，会直接报错而不进行IO操作
* db.**表名**.ex.[list({}) page({}) getById(n) 。。。] 对表对象扩展了 可打印 db.表名.ex查看
##### mysql复杂操作
* 请使用 await db.cmd(sqlStr).run() [兼容j2sql] or  await db.run(sqlStr)
#### redis操作
##### 概述
* io-redis封装，支持所有io-redis 可支持的操作
```javascript
    const rd = await skyDB.redis // 创建redis 实例
    console.log('check key off', rd.keysLimit.add('*')) // 关闭redis检验,或者配置Config.redis
    console.log('设置j2sql2_test', await rd.set('j2sql2_test', '1'))
    console.log('获取j2sql2_test', await rd.get('j2sql2_test'))
    console.log('删除j2sql2_test', await rd.del('j2sql2_test'))
    console.log('获取j2sql2_test', await rd.get('j2sql2_test'))
```
* 以上代码在 async 函数中 运行
* 例子查看 https://github.com/kongnet/j2sql2/blob/master/sample.js
##### redis键值的控制
> 在开发时因为有很多的key-value对，容易遗忘，因此j2sql2 扩展了redis的限制

*在config redis字段中 增加 
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

*  rd.keysLimit.add('*') 关闭所有限制
* rd.keysLimit.status = 1 or rd.keysLimit.del('*') 打开 限制
* 打开后 await rd.get('k1') **报错**  



  
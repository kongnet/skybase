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
1.首先增加api定义
2.是mock接口就直接，在定义的mock字段中增加，controller为空字符串
3.不是mock接口就指明controller字符串，并在router中增加相应的，文件和方法
4.复杂业务就放到service中，router文件中 ，引用使用

### 复杂例子
* http://127.0.0.1:13000/skyapi/probe/mysql  // 查看探针例子 这里treemap的例子可能会出不来，是因为 地图的key是个人的，过期的原因 ./template/treemap-mysql.html

#### mysql操作
#### redis操作
  

  
  
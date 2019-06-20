#api json 自动构建项目

接口列表

1、配置文档中配置 fileApiDir 具体生成api文档
2、/api/list 接口返回 单层目录以及api文档
3、/api/info 接口返回 每次从硬盘中读取 相应文档的json格式 或 相应文档相应api的json格式
4、/api/update 接口更新api的json到内存中---重启就消失
5、/api/output 接口把内存中的api的json保存到文档中
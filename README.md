# skybase
Sky web base suit

## 安装 Install
``` js
npm i skybase
```
## 开始你的web世界 Hello World
``` js
const sky = require('skybase')

sky.start({
  rootDir: __dirname
}, async () => {
  console.log('Program running...')
})
```

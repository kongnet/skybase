'use strict'
/* global describe */
/* global it */
const $ = require('meeko')
const request = require('request-promise-native')
const assert = require('assert')
const path = require('path')
const proPath = '..'
const proCnf = require(path.join(proPath, 'config'))
const skyCnf = require('../node_modules/skybase/config.js')
let apiCnf = $.requireAll(path.join(__dirname, proPath, skyCnf.apiDir))

let apiArr=[]
function objWalk(o,path=''){
  if(!$.tools.isObject(o)) return
    for(let i in o){
        if($.tools.isObject(o[i])){
          if(i==='__swagger__'){
            continue
          }
          if(!o[i].method){
            objWalk(o[i],[path,i].join('/'))

          } else {
            apiArr.push([path,i])
          }
        }
    }
}
objWalk(apiCnf,'')
let newApiArr=[]
apiArr.forEach(x=>{
  let lastItem = x[x.length-1]
  if(lastItem.includes('/')){
    newApiArr.push(lastItem)
  } else {
    newApiArr.push(x.join('/'))
  }
})


describe('接口无参数提交', async () => {
  newApiArr.forEach(x=> {
    let xArr = x.split('/')
    xArr.shift()
        let url = `http://127.0.0.1:${proCnf.port || 13000}${x}`
        it(`${url}`, async () => {
          let apiObj = $.tools.objByString(apiCnf,xArr.join('.'))
          let r = await request({
            uri: url,
            method: apiObj.method === 'all' ? 'get' : apiObj.method || 'get'
          })
          let data
          try{
            data = JSON.parse(r || '{}')
          } catch(e){
            data={}
          }
          assert.notStrictEqual(data.code||0, 500)
        })

  })
})

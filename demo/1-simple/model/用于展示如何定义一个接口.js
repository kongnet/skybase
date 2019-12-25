/**
 * @Author: kongx
 * @Date: 2019-07-25 14:25:32
 * @Name: 用于展示如何定义一个接口
 * @Desc: demo接口
 */

import { getAxios } from './toAxios'
import { isType, paramsCheck } from '@utils/base'
import { messageLayer } from '@utils/message'

export default {

  /**
   * demo接口1
   * 业务参数 o {object} 接口入参
  * @param 你的名字 { string } 该接口将原封返回 默认值:空 是否必填:1

   * 配置参数 c {object} 配置 请在调用时配置
   */

  async undefinedApi1 (o = {}, c = {}) {
    const paramsRule = {'name': {'name': '你的名字', 'desc': '该接口将原封返回', 'req': 1, 'def': null, 'type': 'string'}}
    const checked = paramsCheck(isType(paramsRule, 'object') ? paramsRule : JSON.parse(paramsRule), o)
    if (checked) {
      messageLayer ? messageLayer(checked) : console.log(checked)
      return
    }
    return getAxios('/demo/api1', o, c)
  }

}

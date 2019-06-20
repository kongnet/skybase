'use strict'

/**
 * @author: cuiguanghao
 * @date: 2019年06月18日11:31:06
 * @name: mock.js
 * @description: 闭包函数返回mock数据 已router的方式
 */

/* global $ */

const Mock = require('mockjs')
Mock.Random.extend($.Mock)

module.exports = {
  noMock,
  mockRouter,
  mock
}

function noMock () {
  return function (ctx) {
    ctx.ok('controller未定义 & mock未定义')
  }
}

function mockRouter (mockModels) {
  return function (ctx) {
    ctx.ok(Mock.mock(mockModels))
  }
}

function mock (mockModels) {
  return Mock.mock(mockModels)
}

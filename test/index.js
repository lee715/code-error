'use strict'
/*global it*/
var assert = require('assert')
var CodeError = require('../index')
var webHttpStatus = require('../httpStatusCode.json')

it('httpStatus', function () {
  Object.keys(webHttpStatus).forEach(function (key) {
    var err = CodeError(+key)
    assert(err.toJSON().code)
    assert(err.toString())
    assert(err.status === +key)
  })
})

it('configure', function () {
  // use keywords to define code
  CodeError.configure({
    objectMap: {
      user: 1,
      alien: 2,
      token: 3
    },
    actionMap: {
      invalid: 1,
      unmatch: 2,
      missed: 3
    },
    typeMap: {
      api: {
        typeCode: 104,
        status: 400
      }
    },
    additionKeys: ['action', 'refer'],
    i18n: {
      locales: ['en', 'zh'],
      defaultLocale: 'zh',
      directory: __dirname + '/../test_locales'
    }
  })
  var err = CodeError('api', 'user invalid')
  assert(err.code === 10411)
  console.log(err.toString())
  assert(err.toString() === 'api error: user invalid')
  assert(err.toJSON().type === 'api')
  err = CodeError('api', 'user invalid')
  var localeJson = err.toLocaleJSON({action: 'create', refer: 'github'})
  assert(localeJson.message === '创建Github账户失败')
  assert(localeJson.title === 400)
  localeJson = err.toLocaleJSON({action: 'edit', refer: 'github'})
  assert(localeJson.message === '错误的请求')
})

it('extend', function () {
  CodeError.extend('internal', 500, 101, 10, 10)
  var err = CodeError('internal')
  assert(err.code === 1011010)
  assert(err.toJSON().type === 'internal')
})

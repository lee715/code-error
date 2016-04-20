'use strict'
/*global it*/
var assert = require('assert')
var CodeError = require('../index')
var webHttpStatus = require('../httpStatusCode.json')

it('httpStatus', function () {
  Object.keys(webHttpStatus).forEach(function (key) {
    var err = CodeError(key)
    assert(err.toJSON().code)
    assert(err.toString())
    assert(err.status === +key)
  })
})

it('extend', function () {
  CodeError.extend('internal', 500, 101, 0)
  var err = CodeError('internal', 'this is a internal error with default code')
  assert(err.code === 1010)
  assert(err.toString() === 'InternalError: this is a internal error with default code')
  assert(err.toJSON().type === 'InternalError')
  CodeError.extend('api', 400, 104)
  err = CodeError('api', 'this is a internal error without default code', 62)
  assert(err.code === 10462)
  assert(err.toString() === 'ApiError: this is a internal error without default code')
  assert(err.toJSON().type === 'ApiError')
})

it('configure', function () {
  // use keywords to define code
  CodeError.configure({
    maps: [{
      user: 1,
      alien: 2,
      token: 3
    }, {
      invalid: 1,
      unmatch: 2,
      missed: 3
    }]
  })
  var err = CodeError('api', 'invalid user in xx api', 'user invalid')
  assert(err.code === 10411)
  assert(err.toString() === 'ApiError: invalid user in xx api')
  assert(err.toJSON().type === 'ApiError')
  // use msg for code
  CodeError.configure({
    useMsgForCode: true
  })
  err = CodeError('api', 'user invalid')
  assert(err.code === 10411)
  assert(err.toString() === 'ApiError: user invalid')
  assert(err.toJSON().type === 'ApiError')
  // config split letter
  CodeError.configure({
    splitLetter: ',',
    useMsgForCode: false
  })
  err = CodeError('api', 'invalid user in xx api', 'user,invalid')
  assert(err.code === 10411)
  assert(err.toString() === 'ApiError: invalid user in xx api')
  assert(err.toJSON().type === 'ApiError')
  // config additionKeys
  CodeError.configure({
    additionKeys: ['action', 'refer'],
    i18n: {
      locales: ['en', 'zh'],
      defaultLocale: 'zh',
      directory: __dirname + '/../test_locales'
    }
  })
  err = CodeError('api', 'invalid user in xx api', 11)
  var localeJson = err.toLocaleJSON({action: 'create', refer: 'github'})
  assert(localeJson.message === '创建Github账户失败')
  localeJson = err.toLocaleJSON({action: 'edit', refer: 'github'})
  assert(localeJson.message === '错误的请求')
})

'use strict'
/*global it*/
var assert = require('assert')
var CodeError = require('../index')
var Errors = CodeError.Errors

// Errors.extend('system', 500, 100, 0)
// Errors.extend('internal', 500, 101, 0)
// Errors.extend('param', 400, 103, 0)
// Errors.extend('api', 400, 104)
// Errors.extend('jwt', 400, 105)
// Errors.extend('oauth2', 400, 106)

it('extend', function () {
  Errors.extend('internal', 500, 101, 0)
  var err = CodeError('internal', 'this is a internal error with default code')
  assert(err.code === 1010)
  assert(err.toString() === 'InternalError: this is a internal error with default code')
  assert(err.toJSON().type === 'InternalError')
  Errors.extend('api', 400, 104)
  err = CodeError('api', 'this is a internal error without default code', 62)
  assert(err.code === 10462)
  assert(err.toString() === 'ApiError: this is a internal error without default code')
  assert(err.toJSON().type === 'ApiError')
})

it('configure', function () {
  // use keywords to define code
  Errors.configure({
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
  Errors.configure({
    useMsgForCode: true
  })
  err = CodeError('api', 'user invalid')
  assert(err.code === 10411)
  assert(err.toString() === 'ApiError: user invalid')
  assert(err.toJSON().type === 'ApiError')
  // config split letter
  Errors.configure({
    splitLetter: ',',
    useMsgForCode: false
  })
  err = CodeError('api', 'invalid user in xx api', 'user,invalid')
  assert(err.code === 10411)
  assert(err.toString() === 'ApiError: invalid user in xx api')
  assert(err.toJSON().type === 'ApiError')
})

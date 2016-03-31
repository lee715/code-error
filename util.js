'use strict'
var util = module.exports = {}
var hasProp = {}.hasOwnProperty
var assert = require('assert')

util.extend = function (child, parent) {
  for (var key in parent) {
    if (hasProp.call(parent, key)) child[key] = parent[key]
  }
  function Ctor () {
    this.constructor = child
  }
  Ctor.prototype = parent.prototype
  child.prototype = new Ctor()
  child.__super__ = parent.prototype
  return child
}

util.toErrorName = function (str) {
  assert(str && typeof str === 'string')
  if (util.isNumberLike(str)) return 'Error'
  return str.charAt(0).toUpperCase() + str.slice(1) + 'Error'
}

util.isString = function (str) {
  return typeof str === 'string'
}

util.isNumber = function (str) {
  return typeof str === 'number'
}

util.isNaN = function (str) {
  return util.isNumber(str) && str != +str
}

util.isNumberLike = function (str) {
  if (util.isNumber(str)) {
    return true
  } else if (util.isString(str) && !util.isNaN(+str)) {
    return true
  } else {
    return false
  }
}

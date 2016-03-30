'use strict'
var CodeError = require('./error')
var util = require('./util')

var Errors = {
  _eMap: {},
  _eCodeMap: {},
  _name2codeMaps: [],
  _split: ' '
}

Errors.get = function (name) {
  if (!name || !(typeof name === 'string')) return null
  name = name.toLowerCase()
  return this._eMap[name] || this._eCodeMap[name]
}

Errors.extend = function (name, status, baseCode, customCode) {
  if (!name || !util.isNumberLike(baseCode)) {
    return null
  }
  var existed = this.get(name) || this.get(baseCode)
  if (existed) return existed
  util.extend(Ctor, CodeError)
  function Ctor (msg, code, orignalError) {
    if (Errors._useMsgCode) {
      orignalError = code
      code = Errors.ensureCode(msg)
    }
    Ctor.__super__.constructor(msg, code, orignalError)
    this.name = util.toErrorName(name)
    this._baseCode = baseCode
    this.status = this.statusCode = status || 500
    if (customCode !== undefined) this._customCode = customCode
  }
  this._eMap[name] = Ctor
  this._eCodeMap[baseCode] = Ctor
  return Ctor
}

Errors.configure = function (opts) {
  opts = opts || {}
  if (opts.maps) this._name2codeMaps = opts.maps
  if (opts.splitLetter) this._split = opts.splitLetter
  this._useMsgCode = !!opts.useMsgForCode
}

Errors.str2code = function (str) {
  var arr = str.split(this._split)
  var maps = this._name2codeMaps
  var code = ''
  arr.forEach(function (item, ind) {
    var codePart = maps[ind][item] || 0
    code += codePart
  })
  return +code
}

Errors.ensureCode = function (code) {
  if (util.isNumberLike(code)) return +code
  if (util.isString(code) && ~code.indexOf(this._split)) {
    return this.str2code(code)
  }
  return null
}

Errors.wrap = function (err, type) {
  type = type || 'system'
  var Err = this.get(type)
  if (!Err) return null
  var msg = err.message || '' + err
  var wraped = new Err(msg, err.code, err)
  wraped.stack = err.stack
  return wraped
}

module.exports = function (type, msg, code, orignalError) {
  var Err = Errors.get(type)
  if (!Err) return null
  if (arguments.length === 1) {
    return Err
  } else {
    code = Errors.ensureCode(code)
    return new Err(msg, code, orignalError)
  }
}
module.exports.Errors = Errors

'use strict'
var __ = require('./i18n').__
var hasProp = {}.hasOwnProperty
var statusCodeMap = require('./httpStatusCode.json')
module.exports = CodeError

extend(CodeError, Error)
function CodeError (opts, msg) {
  CodeError.__super__.constructor.call(this)
  this.message = statusCodeMap[opts.type] || opts.type + ' error' + (msg ? ': ' + msg : '')
  this.status = opts.status || 500
  this.code = buildCode(opts)
  this.type = opts.type
  return this
}

CodeError.prototype.toString = function () {
  return this.message
}

CodeError.prototype.toJSON = function () {
  return {
    status: this.status,
    code: this.code,
    message: this.message,
    type: this.type
  }
}

CodeError.prototype.attach = function (err) {
  this.originalError = err
  this.stack = err.stack
  return this
}

CodeError.prototype.toLocaleJSON = function (opts, data) {
  opts = opts || {}
  opts.status = opts.status || this.status
  opts.code = opts.code || this.code
  var localed = __(opts, data)
  localed.code = this.code
  localed.type = this.type
  localed.status = this.status
  return localed
}

function buildCode (opts) {
  opts.actionCode = opts.actionCode === 0 ? 0 : opts.actionCode || ''
  opts.objectCode = opts.objectCode === 0 ? 0 : opts.objectCode || ''
  return +('' + opts.typeCode + opts.objectCode + opts.actionCode)
}

function extend (child, parent) {
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

'use strict'
var util = require('./util')
var __ = require('./i18n').__
module.exports = CodeError

util.extend(CodeError, Error)
function CodeError (msg, code, originalError) {
  CodeError.__super__.constructor.apply(this, arguments)
  this._customCode = code
  this.message = msg
  this.originalError = originalError
}

CodeError.prototype.toString = function () {
  return this.name + ': ' + this.message
}

CodeError.prototype.toJSON = function () {
  return {
    status: this.status,
    code: this.code,
    message: this.message,
    type: this.name
  }
}

CodeError.prototype.toLocaleJSON = function (opts, data) {
  opts = opts || {}
  opts.status = opts.status || this.status
  opts.code = opts.code || this.code
  var localed = __(opts, data)
  localed.code = this.code
  localed.type = this.name
  localed.status = this.status
  return localed
}

Object.defineProperty(CodeError.prototype, 'code', {
  get: function () {
    return +('' + this._baseCode + this._customCode)
  }
})

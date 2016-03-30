'use strict'
var util = require('./util')
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
    code: this.code,
    message: this.message,
    type: this.name
  }
}

Object.defineProperty(CodeError.prototype, 'code', {
  get: function () {
    return +('' + this._baseCode + this._customCode)
  }
})

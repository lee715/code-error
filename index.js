'use strict'
var CodeError = require('./error')
var i18n = require('./i18n')

var CONFIG = {
  splitLetter: ' ',
  get: function (type, key) {
    var map = this[type + 'Map']
    return map && map[key]
  }
}

module.exports = function (type, msg) {
  var codeObj
  if (isNumber(type)) {
    codeObj = {
      type: type,
      status: type,
      typeCode: type
    }
  } else {
    codeObj = CONFIG.get('type', type)
    if (!codeObj) throw new Error('unrecognized error type: ' + type)
  }
  if (msg) {
    var arr = msg.split(CONFIG.splitLetter)
    var objCode = CONFIG.get('object', arr[0])
    var actCode = CONFIG.get('action', arr[1])
    if (!isCode(objCode)) throw new Error('unrecognized error object')
    if (!isCode(actCode)) throw new Error('unrecognized error action')
    codeObj.objectCode = objCode
    codeObj.actionCode = actCode
  }
  codeObj.type = type
  return new CodeError(codeObj, msg)
}

module.exports.configure = function (opts) {
  opts = opts || {}
  // 对象映射
  CONFIG.objectMap = opts.objectMap || {}
  // 行为映射
  CONFIG.actionMap = opts.actionMap || {}
  // 错误类型映射
  CONFIG.typeMap = opts.typeMap || {}
  if (opts.splitLetter) CONFIG.splitLetter = opts.splitLetter
  if (opts.i18n || opts.additionKeys) {
    i18n.configure({
      i18n: opts.i18n,
      additionKeys: opts.additionKeys
    })
  }
}

module.exports.extend = function (name, status, typeCode, objectCode, actionCode) {
  var codeObj = {
    type: name,
    status: status,
    typeCode: typeCode
  }
  if (objectCode !== undefined) codeObj.objectCode = objectCode
  if (objectCode !== undefined) codeObj.actionCode = actionCode
  CONFIG.typeMap[name] = codeObj
}

function isNumber (str) {
  return typeof str == 'number'
}

function isString (str) {
  return typeof str == 'string'
}

function isCode (code) {
  return isNumber(code) && code >= 0 && code < 10000 || isString(code) && /^\d{1, 3}$/.test(code)
}

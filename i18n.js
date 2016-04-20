'use strict'
var i18n = require('i18n')
var _keys = ['status', 'code']
var locales = require('./locales')

exports.__ = function (opts, data) {
  var locale = opts.locale || i18n.getLocale()
  var keys = []
  var cur = null
  for (var i = 0, l = _keys.length; i < l; i++) {
    cur = opts[_keys[i]]
    if (cur) {
      keys.push(cur)
    } else {
      break
    }
  }
  var body = ''
  while (!body && keys.length) {
    body = i18n.__({phrase: keys.join('.'), locale: locale}, data)
    if (body === keys.join('.')) body = ''
    keys.length--
  }
  if (!body) {
    body = locales[locale][opts.status]
  }
  if (!body) {
    var keyStr = _keys.join('.')
    return {title: opts.status, message: keyStr}
  } else {
    var title = i18n.__({phrase: 'title.' + keys.join('.'), locale: locale}, data) || opts.status
    return {title: title, message: body}
  }
}

exports.configure = function (conf) {
  conf = conf || {}
  if (conf.i18n) {
    i18n.configure(conf.i18n)
  }
  if (conf.additionKeys) {
    _keys = _keys.concat(conf.additionKeys)
  }
}

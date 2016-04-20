'use strict'
const fs = require('fs')
const files = fs.readdirSync(__dirname)

files.forEach(function (file) {
  if (/^\w+\.json$/.test(file)) {
    exports[file.replace(/\.json$/, '')] = require(`./${file}`)
  }
})

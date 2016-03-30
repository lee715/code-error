node-code-error
===
define errror with code

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Installation

```bash
npm install node-code-error
```

## Demo
```js
// extend a new type of error
var CodeError = require('node-code-error')
CodeError.extend('api', 400, 100)
var err = CodeError('api', 'db is not defined', 32)
err.status // 400
err.toString() // 'ApiError: db is not defined'
err.toJSON()
/*
  {
    code: 10032,
    message: 'ApiError: db is not defined',
    type: 'ApiError'
  }
*/

// configure CodeError and describe code by keywords
CodeError.configure({
  maps: [{
    user: 1,
    book: 2,
    cat: 3
  }, {
    missed: 1,
    invalid: 2,
    unmatched: 3
  }],
  splitLetter: ' ' // default is ' ',
  useMsgForCode: true // default is false
})
// then you can create err like this
err = CodeError('api', 'user invalid')
err.status // 400
err.toString() // 'ApiError: user invalid'
err.toJSON()
/*
  {
    code: 10012,
    message: 'ApiError: user invalid',
    type: 'ApiError'
  }
*/
```

## API

### CodeError(name, msg, code, originalError)
- factory function for getting an error constructor or creating an instance

```js
var CodeError = require('node-code-error')
CodeError.extend('api', 400, 100)
CodeError('api') // => function ApiError
CodeError('api', 'api error', 32, new Error('xxx')) // => instance of ApiError
```

### CodeError.extend(name, status, baseCode, customCode)

- `name` *Required*, `String`, define the type of the error
- `status` `Number`, define the status of the error, default is 500
- `baseCode` *Required*, `Number`, the first part of the code
- `customCode` *Option*, `Number`, if passed, the last part of code will be always the customCode, this is used for errors with stationary code, like SystemError

```js
var CodeError = require('node-code-error')
CodeError.extend('api', 400, 100)
CodeError('api', 'api error', 43) // code == 10043
CodeError.extend('system', 500, 101, 10)
CodeError('system', 'system error', 43) // code == 10110
```

### CodeError.configure(opts)
- global config.only used for transfering message to code right now.
- maps `Array` map of values for keywords.for common use, you can use maps[0] as map of model, use maps[1] as map of action.then, your error message will like 'user invalid', 'password unmatch', etc.

```js
var CodeError = require('node-code-error')
CodeError.configure({
  maps: [{
    user: 1,
    book: 2,
    cat: 3
  }, {
    missed: 1,
    invalid: 2,
    unmatch: 3
  }],
  splitLetter: ' ' // default is ' ',
  useMsgForCode: true // default is false
})
CodeError.extend('api', 400, 100)
var err = CodeError('api', 'use missed')
err.code // => 10011
var err = CodeError('api', 'book unmatch')
err.code // => 10023
```

### CodeError.wrap(err, name)
- err *Required* `Error` the error to be wrapped
- name *Option* `String` which type of error to wrap, default is 'system'

```js
CodeError.extend('system', 500, 100, 10)
var err = new Error("I'm a nodejs Error")
var wrapped = CodeError.wrap(err, 'system')
wrapped.toString() // => "SystemError: I'm a nodejs Error"
wrapped.toJSON()
/*
  => {
    code: 10010,
    message: "SystemError: I'm a nodejs Error",
    type: "SystemError"
  }
*/
```
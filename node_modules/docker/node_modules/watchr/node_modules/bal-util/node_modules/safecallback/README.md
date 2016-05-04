# SafeCallback [![Build Status](https://secure.travis-ci.org/bevry/safecallback.png?branch=master)](http://travis-ci.org/bevry/safecallback)

Handle asynchronous callback errors safely and easily

## Install

### Backend

1. [Install Node.js](http://bevry.me/node/install)
1. `npm install --save safecallback`

### Frontend

1. [See Browserify](http://browserify.org/)


## Usage

### JavaScript

``` javascript
// Before
var getFileContentsUpperCased = function(path,next){
	require('fs').readFile(path, function(err,data){
		if(err)  return next(err)  // annoying check
		return next(null, data.toString().toUpperCase())
	})
}

// After
var safeCallback = require('safecallback')
var getFileContentsUpperCased = function(path,next){
	require('fs').readFile(path, safeCallback(next, function(err,data){
		return next(null, data.toString().toUpperCase())
	}))
}
```

### CoffeeScript

``` coffeescript
# Before
getFileContentsUpperCased = (path,next) ->
	require('fs').readFile path, (err,data) ->
		return next(err)  if err  # annoying check
		return next(null, data.toString().toUpperCase())

# After
safeCallback = require('safecallback')
getFileContentsUpperCased = (path,next) ->
	require('fs').readFile path, safeCallback next, (err,data) ->
		return next(null, data.toString().toUpperCase())
```


## History
You can discover the history inside the [History.md](https://github.com/bevry/safecallback/blob/master/History.md#files) file


## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<br/>Copyright © 2013+ [Bevry Pty Ltd](http://bevry.me) <us@bevry.me>
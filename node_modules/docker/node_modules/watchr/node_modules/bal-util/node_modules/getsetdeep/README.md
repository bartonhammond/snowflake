# Get Set Deep [![Build Status](https://secure.travis-ci.org/bevry/getsetdeep.png?branch=master)](http://travis-ci.org/bevry/getsetdeep)
Get and set nested variables of an object, includes support for Backbone Models


## Install

### Backend

1. [Install Node.js](http://bevry.me/node/install)
2. `npm install --save getsetdeep`

### Frontend

1. [See Browserify](http://browserify.org)



## Usage

### Example

``` javascript
// Import
var getsetdeep = require('getsetdeep')

// Prepare
var obj = {
	a: {
		b: {
			c: 3
		}
	}
}

// Get
getsetdeep.getDeep(obj, 'a.b.c')     // returns 3
getsetdeep.setDeep(obj, 'a.b.c', 4)  // returns 4
getsetdeep.getDeep(obj, 'a.b.c')     // returns 4
```


### Notes

- `setDeep` also has a fourth argument called `setOnlyIfEmpty` which defaults to `false`, if specified to `true` then `setDeep` will only set the value if the current value is `null` or `undefined`
- We also work with Backbone Models (or rather any model that utilizes an `attributes` object)


## History
You can discover the history inside the [History.md](https://github.com/bevry/getsetdeep/blob/master/History.md#files) file



## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)
<br/>Copyright © 2013+ [Bevry Pty Ltd](http://bevry.me)
<br/>Copyright © 2011-2012 [Benjamin Arthur Lupton](http://balupton.com)

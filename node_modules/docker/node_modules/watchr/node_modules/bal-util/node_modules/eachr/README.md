<!-- TITLE/ -->

# Eachr

<!-- /TITLE -->

<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/bevry/eachr/master.svg)](http://travis-ci.org/bevry/eachr "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/eachr.svg)](https://npmjs.org/package/eachr "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/eachr.svg)](https://npmjs.org/package/eachr "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/bevry/eachr.svg)](https://david-dm.org/bevry/eachr)
[![Dev Dependency Status](https://img.shields.io/david/dev/bevry/eachr.svg)](https://david-dm.org/bevry/eachr#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Give eachr an array or object, and the iterator, in return eachr will give the iterator the value and key of each item, and will stop if the iterator returned false.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('eachr')`
- Install: `npm install --save eachr`

### [Browserify](http://browserify.org/)
- Use: `require('eachr')`
- Install: `npm install --save eachr`
- CDN URL: `//wzrd.in/bundle/eachr@2.0.4`

### [Ender](http://enderjs.com)
- Use: `require('eachr')`
- Install: `ender add eachr`

<!-- /INSTALL -->


## Usage

``` javascript
// Prepare
var each = require("eachr");
var arr = ["first", "second", "third"];
var obj = {a:"first", b:"second", c:"third"};
var iterator = function(value,key){
	console.log({value:value, key:key});
	if ( value === "second" ) {
		console.log("break");
		return false;
	}
};

// Cycle Array
each(arr, iterator);
// {"value":"first",  "key":0}
// {"value":"second", "key":1}
// break

// Cycle Object
each(obj, iterator);
// {"value":"first",  "key":"a"}
// {"value":"second", "key":"b"}
// break
```

<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/eachr/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/eachr/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/bevry/eachr/commits?author=balupton)
- [sfrdmn](https://github.com/sfrdmn) — [view contributions](https://github.com/bevry/eachr/commits?author=sfrdmn)

[Become a contributor!](https://github.com/bevry/eachr/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

- Copyright &copy; Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

and licensed under:

- The incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://opensource.org/licenses/mit-license.php)

<!-- /LICENSE -->



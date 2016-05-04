key-mirror
==============

[![Build Status](https://travis-ci.org/wmira/key-mirror.svg?branch=master)](https://travis-ci.org/wmira/key-mirror)

Takes in a {key1:val1...keyn:valn} and returns {key1:key1,keyn:keyn} ala Reacts keyMirror.
 

```javascript

/** quick usage */

var keyMirror = require('key-mirror');

var ACTIONS = keyMirror({
   UPDATE:null,DELETE:null,ADD:null
});

//ACTIONS.UPDATE === 'UPDATE' 
//ACTIONS.DELETE === 'DELETE'
//ACTIONS.ADD === 'ADD'

```


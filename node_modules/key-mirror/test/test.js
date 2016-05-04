/*globals describe,it */
/* jshint -W097 */

"use strict";

var assert = require("assert");
var keymirror = require("../index.js");


describe('basic test', function(){
    it('should mirror', function(){
        var key;
        var tomirror = {
            "key1" : null,
            "key2" : "key3"
        };
        var mirrored = keymirror(tomirror);
        
        for ( key in mirrored ) {
            assert.equal(key,mirrored[key]);
        }

    });

});

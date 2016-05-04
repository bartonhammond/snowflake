
'use strict';

module.exports =

    /**
     * Takes in a {key:val} and returns a key:key
     *  
     * @param object {key1 : val1 ... keyn:valn}
     */
    function(obj) {
        var key;
        var mirrored = {};

        if ( obj && typeof obj === 'object' ) {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    mirrored[key] = key;
                }
            }
        }
        return mirrored;
    };

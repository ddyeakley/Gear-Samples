/*global require, define, console, $*/

/**
 * App module
 */

define({
    name: 'app',
    requires: [
        'views/initPage'
    ],
    def: function appInit() {
        'use strict';

        function init() {
            console.log('app::init');
        }

        return {
            init: init
        };
    }
});


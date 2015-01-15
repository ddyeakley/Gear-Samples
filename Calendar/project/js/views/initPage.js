/*global define, console, window, document, history, tizen*/

/**
 * Init page module
 */

define({
    name: 'views/initPage',
    requires: [
        'core/event',
        'core/application',
        'core/systeminfo',
        'views/monthPage'
    ],
    def: function viewsInitPage(req) {
        'use strict';

        var e = req.core.event,
            app = req.core.application,
            sysInfo = req.core.systeminfo;

        function bindEvents() {
            // add eventListener for tizenhwkey
            document.addEventListener('tizenhwkey', function (e) {
                if (e.keyName === 'back') {
                    app.exit();
                }
            });
            sysInfo.listenBatteryLowState();
        }

        /**
         * Handler onLowBattery state
         */
        function onLowBattery() {
            app.exit();
        }

        function init() {
            // bind events to page elements
            bindEvents();
            sysInfo.checkBatteryLowState();
        }

        e.listeners({
            'core.systeminfo.battery.low': onLowBattery
        });

        return {
            init: init
        };
    }

});

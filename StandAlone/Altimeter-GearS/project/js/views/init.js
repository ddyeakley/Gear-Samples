/*global define, console, window, document*/

/**
 * Init page module
 */

define({
    name: 'views/init',
    requires: [
        'core/event',
        'core/application',
        'core/systeminfo',
        'views/main'
    ],
    def: function viewsInitPage(req) {
        'use strict';

        var e = req.core.event,
            app = req.core.application,
            sysInfo = req.core.systeminfo,

            imagesToPreload = [
                'images/calibrate.png',
                'images/digital_bottom.png',
                'images/digital_left_bottom.png',
                'images/digital_left_top.png',
                'images/digital_left.png',
                'images/digital_right_bottom.png',
                'images/digital_right_top.png',
                'images/digital_right.png',
                'images/digital_top.png'
            ];

        /**
         * Loads ui images.
         */
        function preloadImages() {
            var image = null,
                length = imagesToPreload.length,
                i = 0;

            for (i = 0; i < length; i += 1) {
                image = new window.Image();
                image.src = imagesToPreload[i];
            }
        }

        /**
         * Registers view event listeners.
         */
        function bindEvents() {
            document.addEventListener('tizenhwkey', function (e) {
                if (e.keyName === 'back') {
                    app.exit();
                }
            });
            sysInfo.listenBatteryLowState();
        }

        /**
         * Handles core.battery.low event.
         */
        function onLowBattery() {
            app.exit();
        }

        /**
         * Returns true if device is supported for running application,
         * false otherwise.
         * @return {boolean}
         */
        function isDeviceSupported() {
            return window.navigator.platform.indexOf('armv7l') !== -1;
        }

        /**
         * Handles core.battery.checked state.
         */
        function onBatteryChecked() {
            if (!isDeviceSupported()) {
                e.fire('device.not.supported');
            } else {
                e.fire('device.supported');
            }
        }

        /**
         * Initializes module.
         */
        function init() {
            preloadImages();
            bindEvents();
            sysInfo.checkBatteryLowState();
        }

        e.listeners({
            'core.systeminfo.battery.low': onLowBattery,
            'core.systeminfo.battery.checked': onBatteryChecked
        });

        return {
            init: init
        };
    }

});

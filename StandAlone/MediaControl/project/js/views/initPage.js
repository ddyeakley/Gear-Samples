/*global define, window, tizen, document*/
/**
 * Init page module
 */

define({
    name: 'views/initPage',
    requires: [
        'core/event',
        'core/template',
        'core/application',
        'core/systeminfo',
        'views/media'
    ],
    def: function viewsInitPage(req) {
        'use strict';

        var e = req.core.event,
            app = req.core.application,
            sysInfo = req.core.systeminfo;

        /**
         * Handler for hard back key event.
         */
        function onHardwareKeysTap(ev) {
            var keyName = ev.keyName;
            if (keyName === 'back') {
                app.exit();
            }
        }

        /**
         * Handles visibilitychange event.
         */
        function onVisibilityChange() {
            e.fire('visibility.change');
        }

        /**
         * Handles unload event.
         */
        function onUnload() {
            e.fire('application.unload');
        }

        /**
         * Handles window blur event.
         */
        function onBlur() {
            e.fire('application.state.background');
        }

        /**
         * Attach event handlers to DOM elements.
         */
        function bindEvents() {
            window.addEventListener('tizenhwkey', onHardwareKeysTap);
            window.addEventListener('unload', onUnload);
            document.addEventListener('visibilitychange', onVisibilityChange);
            window.addEventListener('blur', onBlur);
            sysInfo.listenBatteryLowState();
        }

        /**
         * Handler core.battery.low state
         */
        function onLowBattery() {
            app.exit();
        }

        /**
         * Return true if device is supported for running application,
         * false otherwise.
         * @return {boolean}
         */
        function isDeviceSupported() {
            return window.navigator.platform.indexOf('emulated') === -1;
        }

        /**
         * Handler core.battery.checked state
         */
        function onBatteryChecked() {
            if (!isDeviceSupported()) {
                e.fire('device.not.supported');
            } else {
                e.fire('device.supported');
            }
        }

        /**
         * Module initializer.
         */
        function init() {
            sysInfo.checkBatteryLowState();
            bindEvents();
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

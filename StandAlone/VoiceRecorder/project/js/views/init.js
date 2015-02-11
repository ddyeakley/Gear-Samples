/*global define, console, window, document, history, tizen*/

/**
 * Init page module
 */

define({
    name: 'views/init',
    requires: [
        'core/event',
        'core/application',
        'core/systeminfo',
        'views/main',
        'views/preview'
    ],
    def: function viewsInit(req) {
        'use strict';

        var e = req.core.event,
            app = req.core.application,
            sysInfo = req.core.systeminfo,

            imagesToPreload = [
                'images/button_off.png',
                'images/button_on.png',
                'images/pause_icon.png',
                'images/play_icon.png',
                'images/record_icon.png',
                'images/stop_icon.png',
                'images/microphone_full.jpg',
                'images/speaker_full.jpg',
                'images/speaker_animate.png'
            ];

        /**
         * Handles tizenhwkey event.
         * @param {event} ev
         */
        function onHardwareKeysTap(ev) {
            var keyName = ev.keyName,
                page = document.getElementsByClassName('ui-page-active')[0],
                pageid = (page && page.id) || '';

            if (keyName === 'back') {
                if (pageid === 'main') {
                    app.exit();
                } else {
                    history.back();
                }
            }
        }

        /**
         * Pre-loads images.
         */
        function preloadImages() {
            var image = null,
                i = 0,
                length = imagesToPreload.length;

            for (i = 0; i < length; i += 1) {
                image = new window.Image();
                image.src = imagesToPreload[i];
            }
        }

        /**
         * Handles core.battery.low event.
         */
        function onLowBattery() {
            app.exit();
        }

        /**
         * Handles visibilitychange event.
         * @param {event} ev
         */
        function onVisibilityChange(ev) {
            e.fire('visibility.change', ev);
        }

        /**
         * Handles window blur event.
         */
        function onBlur() {
            e.fire('application.state.background');
        }

        /**
         * Registers event listeners.
         */
        function bindEvents() {
            document.addEventListener('tizenhwkey', onHardwareKeysTap);
            document.addEventListener('visibilitychange', onVisibilityChange);
            window.addEventListener('blur', onBlur);
            sysInfo.listenBatteryLowState();
        }

        /**
         * Inits module.
         */
        function init() {
            preloadImages();
            sysInfo.checkBatteryLowState();
            bindEvents();
        }

        e.listeners({
            'core.systeminfo.battery.low': onLowBattery
        });

        return {
            init: init
        };
    }

});

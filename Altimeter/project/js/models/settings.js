/*global define, console*/

/**
 * Settings model.
 */

define({
    name: 'models/settings',
    requires: [
        'core/storage/idb',
        'core/event'
    ],
    def: function modelsSettings(req) {
        'use strict';

        var e = req.core.event,
            s = req.core.storage.idb,

            STORAGE_KEY = 'settings',

            DEFAULT = Object.freeze({
                pressure: 1013.25
            }),

            settings = {};

        /**
         * Saves settings to storage.
         */
        function saveSettings() {
            s.add(STORAGE_KEY, settings);
        }

        /**
         * Sets given settings property.
         * @param {string} property
         * @param {number} value
         * @return {boolean}
         */
        function set(property, value) {
            if (property !== undefined && value !== undefined) {
                settings[property] = value;
                saveSettings();
                return true;
            }
            return false;
        }

        /**
         * Returns given settings property.
         * @param {string} property
         * @return {number}
         */
        function get(property) {
            if (settings[property] === undefined) {
                console.error('Settings not initialized yet.');
                return null;
            }
            return settings[property];
        }

        /**
         * Initializes module.
         */
        function init() {
            s.get(STORAGE_KEY);
        }

        /**
         * Handles core.storage.idb.read event.
         * @param {event} ev
         */
        function onRead(ev) {
            if (ev.detail.key !== STORAGE_KEY) {
                return;
            }
            if (typeof ev.detail.value !== 'object') {
                settings = {
                    pressure: DEFAULT.pressure
                };
                saveSettings();
            } else {
                settings = ev.detail.value;
            }
            e.fire('ready');
        }

        /**
         * Make sure that init is run when storage is ready.
         */
        function runInit() {
            if (s.isReady()) {
                init();
            } else {
                e.listen('core.storage.idb.open', init);
            }
        }

        e.listeners({
            'core.storage.idb.read': onRead
        });

        return {
            init: runInit,
            get: get,
            set: set
        };
    }

});

/*global define, console */

/**
 * Sensor model.
 */

define({
    name: 'models/pressure',
    requires: [
        'core/event',
        'core/window'
    ],
    def: function modelsPressure(e, window) {
        'use strict';

        var sensorService = null,
            pressureSensor = null,
            SENSOR_TYPE = 'PRESSURE',
            ERROR_TYPE_NOT_SUPPORTED = 'NotSupportedError',

            previousPressures = [],
            MAX_LENGTH = 7,
            averagePressure = 0,
            currentPressure = 0;

        /**
         * Performs action on start sensor success.
         */
        function onSensorStartSuccess() {
            e.fire('start');
        }

        /**
         * Performs action on start sensor error.
         * @param {Error} e
         */
        function onSensorStartError(e) {
            console.error('Pressure sensor start error: ', e);
            e.fire('error', e);
        }

        function updateAveragePressure(currentPressure) {
            previousPressures.push(currentPressure);

            var len = previousPressures.length;

            if (len <= MAX_LENGTH) {
                // nothing to shift yet, recalculate whole average
                averagePressure  = previousPressures.reduce(function sum(a, b) {
                    return a + b;
                }) / len;
            } else {
                // add the new item and subtract the one shifted out
                averagePressure += (
                    currentPressure - previousPressures.shift()
                ) / len;
            }
            return averagePressure;
        }

        /**
         * Performs action on sensor change.
         * @param {object} data
         */
        function onSensorChange(data) {
            currentPressure = data.pressure;
            updateAveragePressure(currentPressure);
            e.fire('change', {
                current: data.pressure,
                average: averagePressure
            });
        }

        /**
         * Starts sensor.
         */
        function start() {
            pressureSensor.start(onSensorStartSuccess, onSensorStartError);
        }

        /**
         * Sets sensor change listener.
         */
        function setChangeListener() {
            pressureSensor.setChangeListener(onSensorChange);
        }

        /**
         * Returns sensor value.
         */
        function getSensorValue() {
            return currentPressure;
        }

        /**
         * Returns average of several past readings.
         * @return {number}
         */
        function getAverageSensorValue() {
            return averagePressure;
        }

        /**
         * Handles sensor data.
         * @param {object} data
         */
        function setCurrentPressureValue(data) {
            currentPressure = data.pressure;
        }

        /**
         * Returns true if sensor is available, false otherwise.
         * @return {boolean}
         */
        function isAvailable() {
            return !!pressureSensor;
        }

        /**
         * Initializes module.
         */
        function init() {
            sensorService = (window.webapis && window.webapis.sensorservice) ||
                null;

            if (!sensorService) {
                e.fire('error', {type: 'notavailable'});
            } else {
                try {
                    pressureSensor = sensorService
                        .getDefaultSensor(SENSOR_TYPE);
                    pressureSensor
                        .getPressureSensorData(setCurrentPressureValue);
                } catch (error) {
                    if (error.type === ERROR_TYPE_NOT_SUPPORTED) {
                        e.fire('error', {type: 'notsupported'});
                    } else {
                        e.fire('error', {type: 'unknown'});
                    }
                }
            }
        }

        return {
            initSensor: init,
            start: start,
            isAvailable: isAvailable,
            setChangeListener: setChangeListener,
            getAverageSensorValue: getAverageSensorValue,
            getSensorValue: getSensorValue
        };
    }

});

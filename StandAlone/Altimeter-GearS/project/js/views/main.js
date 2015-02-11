/*global define, console, document, tau*/
/*jslint plusplus: true*/

/**
 * Main page module
 */

define({
    name: 'views/main',
    requires: [
        'core/event',
        'models/settings',
        'models/pressure',
        'core/window',
        'core/application',
        'helpers/dom'
    ],
    def: function viewsMainPage(req) {
        'use strict';

        var e = req.core.event,
            sensor = req.models.pressure,
            settings = req.models.settings,
            window = req.core.window,
            app = req.core.application,
            dom = req.helpers.dom,

            ARE_YOU_SURE_MSG = 'Are you sure you want to calibrate device?',
            ON_TARGET_ONLY_MSG = 'App works only on Target. ' +
                'Please run this on Target.',
            SENSOR_NOT_AVAILABLE_MSG = 'Pressure sensor is not available.',
            SENSOR_NOT_SUPPORTED_MSG = 'Pressure sensor is not supported ' +
                'on this device.',
            SENSOR_UNKNOWN_ERROR_MSG = 'Unknown sensor error occurs.',

            page = null,
            content = null,
            calibrationMonit = null,
            calibrationMonitText = null,
            workingSpace = null,
            calibrationBtn = null,
            yesBtn = null,
            noBtn = null,
            referenceValue = null,
            pressureValue = null,
            altitudeValue = null,
            alertElement = null,
            alertMessage = null,
            alertOk = null;

        /**
         * Updates reference pressure value.
         */
        function updateReferenceValue() {
            referenceValue.innerText = settings.get('pressure').toFixed(2);
        }

        /**
         * Updates current pressure value.
         * @param {number} value
         */
        function updatePressureValue(value) {
            pressureValue.innerText = value.toFixed(2);
        }

        /**
         * Updates altitude value.
         * @param {number} value
         */
        function updateAltitudeValue(value) {
            var reference = settings.get('pressure'),
                text = '',
                altitude = -8727 * Math.log(value / reference);

            text = altitude.toFixed(0);
            if (text === '-0') {
                text = '0';
            }
            altitudeValue.innerText = text;
        }

        /**
         * Resets altitude value.
         */
        function resetAltitudeValue() {
            altitudeValue.innerText = '0';
        }

        /**
         * Shows application working space.
         */
        function showWorkingSpace() {
            calibrationMonit.classList.add('hidden');
            workingSpace.classList.remove('hidden');
            updateReferenceValue();
        }

        /**
         * Shows application content.
         */
        function showApplicationContent() {
            content.classList.remove('hidden');
        }

        /**
         * Shows application start monit.
         */
        function showCalibrationMonit() {
            workingSpace.classList.add('hidden');
            calibrationMonit.classList.remove('hidden');
        }

        /**
         * Calibrates pressure.
         */
        function calibratePressure() {
            settings.set('pressure', sensor.getAverageSensorValue());
            resetAltitudeValue();
            updateReferenceValue();
        }

        /**
         * Shows alert popup.
         * @param {string} message Message.
         */
        function openAlert(message) {
            alertMessage.innerHTML = message;
            tau.openPopup(alertElement);
        }

        /**
         * Handles click event on calibration button.
         */
        function onCalibrationBtnClick() {
            showCalibrationMonit();
        }

        /**
         * Handles click event on page.
         * @param {event} ev
         */
        function onPageClick(ev) {
            if (dom.findParentByClassName(ev.target, 'main-button')) {
                calibrationMonitText.innerHTML = ARE_YOU_SURE_MSG;
                page.removeEventListener('click', onPageClick);
            }
        }

        /**
         * Handles click event on yes button.
         */
        function onYesBtnClick() {
            showWorkingSpace();
            calibratePressure();
        }

        /**
         * Handles click event on no button.
         */
        function onNoBtnClick() {
            showWorkingSpace();
        }

        /**
         * Handles sensor.start event.
         */
        function onSensorStart() {
            showApplicationContent();
            showCalibrationMonit();
        }

        /**
         * Handles models.pressure.error event.
         * @param {object} data
         */
        function onSensorError(data) {
            var type = data.detail.type;

            if (type === 'notavailable') {
                openAlert(SENSOR_NOT_AVAILABLE_MSG);
            } else if (type === 'notsupported') {
                openAlert(SENSOR_NOT_SUPPORTED_MSG);
            } else {
                openAlert(SENSOR_UNKNOWN_ERROR_MSG);
            }
        }

        /**
         * Handles sensor.change event.
         * @param {Event} ev
         */
        function onSensorChange(ev) {
            updatePressureValue(ev.detail.average);
            updateAltitudeValue(ev.detail.average);
        }

        /**
         * Handles device.supported event.
         */
        function onDeviceSupported() {
            sensor.initSensor();
            if (sensor.isAvailable()) {
                sensor.setChangeListener();
                sensor.start();
            }
        }

        /**
         * Handles device.not.supported event.
         */
        function onDeviceNotSupported() {
            openAlert(ON_TARGET_ONLY_MSG);
        }

        /**
         * Handles click event on OK button.
         */
        function onOkClick() {
            tau.closePopup();
        }

        /**
         * Handles popupHide event on popup element.
         */
        function onPopupHide() {
            app.exit();
        }

        /**
         * Registers event listeners.
         */
        function bindEvents() {
            page.addEventListener('click', onPageClick);
            calibrationBtn.addEventListener('click', onCalibrationBtnClick);
            yesBtn.addEventListener('click', onYesBtnClick);
            noBtn.addEventListener('click', onNoBtnClick);
            alertElement.addEventListener('popuphide', onPopupHide);
            alertOk.addEventListener('click', onOkClick);
        }

        /**
         * Initializes module.
         */
        function init() {
            page = document.getElementById('main');
            content = document.getElementById('main-content');
            calibrationMonit = document.getElementById(
                'main-calibration-monit'
            );
            calibrationMonitText = document.getElementById(
                'main-calibration-monit-text'
            );
            workingSpace = document.getElementById('main-working-space');
            calibrationBtn = document.getElementById('main-calibration-btn');
            yesBtn = document.getElementById(
                'main-calibration-monit-buttons-yes'
            );
            noBtn = document.getElementById(
                'main-calibration-monit-buttons-no'
            );
            referenceValue = document.getElementById('main-reference-value');
            pressureValue = document.getElementById('main-pressure-value');
            altitudeValue = document.getElementById('main-altitude-value');
            alertElement = document.getElementById('alert');
            alertMessage = document.getElementById('alert-message');
            alertOk = document.getElementById('alert-ok');
            bindEvents();
        }

        e.listeners({
            'models.pressure.start': onSensorStart,
            'models.pressure.error': onSensorError,
            'models.pressure.change': onSensorChange,
            'views.init.device.supported': onDeviceSupported,
            'views.init.device.not.supported': onDeviceNotSupported
        });

        return {
            init: init
        };
    }

});

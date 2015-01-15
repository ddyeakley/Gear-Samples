/*global define, console, document, window, tau, setInterval, clearInterval*/
/*jslint plusplus: true*/

/**
 * Main page module
 */

define({
    name: 'views/main',
    requires: [
        'core/event',
        'core/application',
        'models/stream',
        'models/audio'
    ],
    def: function viewsMain(req) {
        'use strict';

        var e = req.core.event,
            app = req.core.application,
            s = req.models.stream,
            a = req.models.audio,

            ERROR_FILE_WRITE = 'FILE_WRITE_ERR',
            NO_FREE_SPACE_MSG = 'No free space.',
            CANNOT_ACCESS_AUDIO_MSG = 'Cannot access audio stream. ' +
                'Please close all applications that use the audio stream and ' +
                'open the application again.',

            page = null,
            recordBtn = null,
            recordBtnIcon = null,
            recordBtnMap = null,
            recordProgress = null,
            recordProgressVal = null,
            exitAlertMessage = null,
            exitAlertOk = null,

            stream = null,

            RECORDING_INTERVAL_STEP = 100,

            recordingInterval = null,
            recording = false,
            recordingTime = 0,
            exitInProgress = false,
            recordingLock = false,

            recordBtnTouchCounter = 0;

        /**
         * Toggles between recording/no recording state.
         * @param {boolean} forceValue
         */
        function toggleRecording(forceValue) {
            if (forceValue !== undefined) {
                recording = !!forceValue;
            } else {
                recording = !recording;
            }
        }

        /**
         * Shows stop button.
         */
        function showStopButton() {
            recordBtnIcon.classList.add('recording');
        }

        /**
         * Hides stop button.
         */
        function hideStopButton() {
            recordBtnIcon.classList.remove('recording');
        }

        /**
         * Shows recording view.
         */
        function showRecordingView() {
            showStopButton();
        }

        /**
         * Renders recording progress bar value.
         * @param {number} value
         */
        function renderRecordingProgressBarValue(value) {
            recordProgressVal.style.width = value + 'px';
        }

        /**
         * Renders recording progress bar.
         */
        function renderRecordingProgressBar() {
            var parentWidth = recordProgress.clientWidth,
                width = recordingTime / a.MAX_RECORDING_TIME * parentWidth;
            renderRecordingProgressBarValue(width);
        }

        /**
         * Resets recording progress.
         */
        function resetRecordingProgress() {
            recordingTime = 0;
            renderRecordingProgressBar();
        }

        /**
         * Removes recording interval.
         */
        function removeRecordingInterval() {
            clearInterval(recordingInterval);
        }

        /**
         * Updates recording progress.
         */
        function updateRecordingProgress() {
            recordingTime = a.getRecordingTime();

            renderRecordingProgressBar();
        }

        /**
         * Sets recording interval.
         */
        function setRecordingInterval() {
            recordingInterval = setInterval(
                updateRecordingProgress,
                RECORDING_INTERVAL_STEP
            );
        }

        /**
         * Starts audio recording.
         */
        function startRecording() {
            recordingLock = true;
            a.startRecording();
            resetRecordingProgress();
            showRecordingView();
        }

        /**
         * Stops audio recording.
         */
        function stopRecording() {
            recordingLock = true;
            a.stopRecording();
        }

        /**
         * Starts or stops audio recording.
         */
        function setRecording() {
            if (recording) {
                startRecording();
            } else {
                stopRecording();
            }
        }

        /**
         * Handles click event on record button.
         */
        function onRecordBtnClick() {
            if (recordingLock || document.hidden) {
                return;
            }
            toggleRecording();
            setRecording();
        }

        /**
         * Sets pressed class for button.
         */
        function setPressButtonState() {
            recordBtn.classList.add('pressed');
            recordBtnIcon.classList.add('pressed');
        }

        /**
         * Removes pressed class for button.
         */
        function removePressButtonState() {
            recordBtn.classList.remove('pressed');
            recordBtnIcon.classList.remove('pressed');
        }

        /**
         * Handles touchstart event on record button.
         * @param {event} ev
         */
        function onRecordBtnTouchStart(ev) {
            recordBtnTouchCounter = recordBtnTouchCounter + 1;
            if (ev.touches.length === 1) {
                setPressButtonState();
            }
        }

        /**
         * Handles touchend event on record button.
         */
        function onRecordBtnTouchEnd() {
            recordBtnTouchCounter = recordBtnTouchCounter - 1;
            if (recordBtnTouchCounter === 0) {
                removePressButtonState();
            }
        }

        /**
         * Handles page before show event.
         */
        function onPageBeforeShow() {
            recordingLock = false;
            toggleRecording(false);
            hideStopButton();
            resetRecordingProgress();
        }

        /**
         * Handles click event on exit alert OK button.
         */
        function onExitAlertOkClick() {
            app.exit();
        }

        /**
         * Registers event listeners.
         */
        function bindEvents() {
            page.addEventListener('pagebeforeshow', onPageBeforeShow);
            recordBtnMap.addEventListener('click', onRecordBtnClick);
            recordBtnMap.addEventListener('touchstart', onRecordBtnTouchStart);
            recordBtnMap.addEventListener('touchend', onRecordBtnTouchEnd);
            exitAlertOk.addEventListener('click', onExitAlertOkClick);
        }

        /**
         * Shows exit alert popup.
         * @param {string} message
         */
        function showExitAlert(message) {
            exitAlertMessage.innerHTML = message;
            tau.openPopup('#exit-alert');
        }

        /**
         * Handles models.stream.ready event.
         * @param {event} ev
         */
        function onStreamReady(ev) {
            stream = ev.detail.stream;
            a.registerStream(stream);
        }

        /**
         * Handles models.stream.cannot.access.audio event.
         */
        function onStreamCannotAccessAudio() {
            if (document.visibilityState === 'visible') {
                showExitAlert(CANNOT_ACCESS_AUDIO_MSG);
            }
        }

        /**
         * Inits stream.
         */
        function initStream() {
            s.getStream();
        }

        /**
         * Handles audio.ready event.
         */
        function onAudioReady() {
            console.log('onAudioReady()');
        }

        /**
         * Handles audio.error event.
         */
        function onAudioError() {
            console.error('onAudioError()');
        }

        /**
         * Handles audio.recording.start event.
         */
        function onRecordingStart() {
            setRecordingInterval();
            toggleRecording(true);
            recordingLock = false;
        }

        /**
         * Handles audio.recording.done event.
         * @param {event} ev
         */
        function onRecordingDone(ev) {
            var path = ev.detail.path;

            removeRecordingInterval();
            toggleRecording(false);
            updateRecordingProgress();
            if (!exitInProgress) {
                e.fire('show.preview', {audio: path});
            }
        }

        /**
         * Handles audio.recording.cancel event.
         */
        function onRecordingCancel() {
            toggleRecording(false);
            removePressButtonState();
            hideStopButton();
        }

        /**
         * Handles audio.recording.error event.
         * @param {CustomEvent} ev
         */
        function onRecordingError(ev) {
            var error = ev.detail.error;

            if (error === ERROR_FILE_WRITE) {
                console.error(NO_FREE_SPACE_MSG);
            } else {
                console.error('Error: ' + error);
            }

            removeRecordingInterval();
            toggleRecording(false);
        }

        /**
         * Handles application exit event.
         */
        function onApplicationExit() {
            exitInProgress = true;
            if (a.isReady()) {
                a.release();
                stream.stop();
            }
        }

        /**
         * Function called when application visibility state changes
         * (document.visibilityState changed to 'visible' or 'hidden').
         */
        function visibilityChange() {
            if (document.visibilityState !== 'visible') {
                if (a.isReady()) {
                    a.stopRecording();
                    a.release();
                }
            } else {
                if (!a.isReady()) {
                    initStream();
                }
            }
        }

        /**
         * Handles application.state.background event.
         */
        function onApplicationStateBackground() {
            removePressButtonState();
            recordBtnTouchCounter = 0;
        }

        /**
         * Inits module.
         */
        function init() {
            page = document.getElementById('main');
            recordBtn = document.getElementById(
                'main-navigation-bar-button'
            );
            recordBtnIcon = document.getElementById(
                'main-navigation-bar-button-icon'
            );
            recordBtnMap = document.getElementById(
                'main-navigation-bar-button-map'
            );
            recordProgress = document.getElementById('record-progress');
            recordProgressVal = document.getElementById('record-progress-val');
            exitAlertMessage = document.getElementById('exit-alert-message');
            exitAlertOk = document.getElementById('exit-alert-ok');
            bindEvents();
            initStream();
        }

        e.listeners({
            'application.exit': onApplicationExit,

            'models.stream.ready': onStreamReady,
            'models.stream.cannot.access.audio': onStreamCannotAccessAudio,

            'models.audio.ready': onAudioReady,
            'models.audio.error': onAudioError,

            'models.audio.recording.start': onRecordingStart,
            'models.audio.recording.done': onRecordingDone,
            'models.audio.recording.error': onRecordingError,
            'models.audio.recording.cancel': onRecordingCancel,

            'views.init.visibility.change': visibilityChange,
            'views.init.application.state.background':
                onApplicationStateBackground
        });

        return {
            init: init
        };
    }

});

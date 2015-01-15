/*global define, window, speechSynthesis, SpeechSynthesisUtterance*/
/*jslint regexp: true*/

/**
 * TTS module
 */

define({
    name: 'models/tts',
    requires: [

    ],
    def: function modelsTTS() {
        'use strict';

        /**
         * Is TTS supported flag.
         * @type {boolean}
         */
        var ttsSupported = false;

        /**
         * Cancels speaking.
         */
        function cancel() {
            if (ttsSupported) {
                speechSynthesis.cancel();
            }
        }

        /**
         * Pauses speaking.
         */
        function pause() {
            if (ttsSupported) {
                speechSynthesis.pause();
            }
        }

        /**
         * Resumes speaking.
         */
        function resume() {
            if (ttsSupported) {
                speechSynthesis.resume();
            }
        }

        /**
         * Speaks specified text.
         * @param {string} text
         */
        function speak(text) {
            if (ttsSupported) {
                var utterance = new SpeechSynthesisUtterance();

                utterance.text = text;
                utterance.lang = 'en-US';
                utterance.rate = 1.0;
                cancel();
                speechSynthesis.speak(utterance);
            }
        }

        /**
         * Module initializer.
         */
        function init() {
            ttsSupported = window.speechSynthesis !== undefined &&
                window.SpeechSynthesisUtterance !== undefined;
        }

        return {
            init: init,
            speak: speak,
            cancel: cancel,
            pause: pause,
            resume: resume
        };
    }
});

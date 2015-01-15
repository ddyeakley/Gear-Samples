/*global define, console, document, tau, Math, alert, window, tizen,
setTimeout*/
/*jslint plusplus: true*/

/**
 * Settings page module
 */

define({
    name: 'views/preview',
    requires: [
        'core/event',
        'helpers/page'
    ],
    def: function viewsPreview(req) {
        'use strict';

        var e = req.core.event,
            pageHelper = req.helpers.page,

            CLEAR_PROGRESS_BAR_TIMEOUT = 100,

            page = null,
            audio = null,
            prevBtn = null,
            prevBtnIcon = null,
            prevBtnMap = null,
            prevProgress = null,
            prevProgressVal = null,
            voiceAnimation = null,

            audioPlayState = false,
            blockProgressTapAction = false,

            prevBtnTouchCounter = 0;

        /**
         * Shows preview page.
         * @param {event} ev
         */
        function showPreviewPage(ev) {
            tau.changePage('#preview');
            ev.target.removeEventListener(ev.type, showPreviewPage);
        }

        /**
         * Handles views.settings.show event.
         * @param {event} ev
         */
        function show(ev) {
            var detail = ev.detail;

            prevProgressVal.style.width = '0';
            audioPlayState = false;
            audio.src = detail.audio;
            audio.addEventListener('loadeddata', showPreviewPage);
        }

        /**
         * Toggles audio preview play state.
         */
        function toggleAudioPlayState() {
            audioPlayState = !audioPlayState;
        }

        /**
         * Resets audio.
         */
        function setPausedButton() {
            prevBtnIcon.classList.add('paused');
            voiceAnimation.classList.add('paused');
            audioPlayState = false;
        }

        /**
         * Pauses preview playing.
         */
        function pausePreview() {
            setPausedButton();
            audio.pause();
        }

        /**
         * Handles visibility.change event.
         */
        function onVisibilityChange() {
            if (pageHelper.isPageActive(page)) {
                audioPlayState = false;
                pausePreview();
                blockProgressTapAction = false;
            }
        }

        /**
         * Starts preview playing.
         */
        function playPreview() {
            prevBtnIcon.classList.remove('paused');
            voiceAnimation.classList.remove('paused');
            audio.play();
        }

        /**
         * Handles ended event on audio element.
         */
        function onAudioEnded() {
            setPausedButton();
        }

        /**
         * Handles timeupdate event on audio element.
         * @param {event} ev
         */
        function onTimeUpdate(ev) {
            var target = ev.target,
                val = target.currentTime,
                duration = target.duration;

            if (val === duration) {
                prevProgressVal.style.width = '100%';
                setTimeout(
                    function clearProgressBar() {
                        prevProgressVal.style.width = '0';
                    },
                    CLEAR_PROGRESS_BAR_TIMEOUT
                );
            } else {
                prevProgressVal.style.width =
                    (duration === 0 ? 0 : val / duration * 100) + '%';
            }
        }

        /**
         * Handles audio error event.
         */
        function onAudioError() {
            console.error('Recording cannot be loaded into preview.');
        }

        /**
         * Handles hide event on page.
         */
        function onPageHide() {
            pausePreview();
        }

        /**
         * Handles click event on preview button.
         */
        function onPreviewBtnClick() {
            toggleAudioPlayState();
            if (audioPlayState) {
                playPreview();
            } else {
                pausePreview();
            }
        }

        /**
         * Sets pressed class for button.
         */
        function setPressButtonState() {
            prevBtn.classList.add('pressed');
            prevBtnIcon.classList.add('pressed');
        }

        /**
         * Removes pressed class for button.
         */
        function removePressButtonState() {
            prevBtn.classList.remove('pressed');
            prevBtnIcon.classList.remove('pressed');
        }

        /**
         * Handles touchstart event on preview button.
         * @param {event} ev
         */
        function onPreviewBtnTouchStart(ev) {
            prevBtnTouchCounter = prevBtnTouchCounter + 1;
            if (ev.touches.length === 1) {
                setPressButtonState();
            }
        }

        /**
         * Handles touchend event on preview button.
         */
        function onPreviewBtnTouchEnd() {
            prevBtnTouchCounter = prevBtnTouchCounter - 1;
            if (prevBtnTouchCounter === 0) {
                removePressButtonState();
            }
        }

        /**
         * Handles tap on audio progress bar.
         * @param {event} ev
         */
        function onAudioProgressTap(ev) {
            var width = prevProgress.offsetWidth,
                left = prevProgress.offsetLeft,
                offsetPosition = ev.targetTouches[0].pageX - left,
                progressValue = 0;

            if (ev.touches.length > 1 || blockProgressTapAction) {
                blockProgressTapAction = true;
                return;
            }

            ev.preventDefault();
            ev.stopPropagation();

            if (width && audio.duration && offsetPosition < width) {
                progressValue = offsetPosition / width;
                audio.currentTime = progressValue * audio.duration;
            }
        }

        /**
         * Handles tap end on audio progress bar.
         * @param {event} ev
         */
        function onAudioProgressTapEnd(ev) {
            ev.stopPropagation();

            blockProgressTapAction = ev.touches.length > 0;
        }

        /**
         * Handles application.state.background event.
         */
        function onApplicationStateBackground() {
            removePressButtonState();
            prevBtnTouchCounter = 0;
        }

        /**
         * Handles touchend event on page element.
         * @param {event} ev
         */
        function onPageTouchEnd(ev) {
            blockProgressTapAction = ev.touches.length > 0;
        }

        /**
         * Registers view event listeners.
         */
        function bindEvents() {
            page.addEventListener('pagehide', onPageHide);
            page.addEventListener('touchend', onPageTouchEnd);
            prevBtnMap.addEventListener('click', onPreviewBtnClick);
            prevBtnMap.addEventListener('touchstart', onPreviewBtnTouchStart);
            prevBtnMap.addEventListener('touchend', onPreviewBtnTouchEnd);
            audio.addEventListener('ended', onAudioEnded);
            audio.addEventListener('timeupdate', onTimeUpdate);
            audio.addEventListener('error', onAudioError);
            prevProgress.addEventListener('touchstart', onAudioProgressTap);
            prevProgress.addEventListener('touchmove', onAudioProgressTap);
            prevProgress.addEventListener('touchend', onAudioProgressTapEnd);
        }

        /**
         * Inits module.
         */
        function init() {
            page = document.getElementById('preview');
            audio = document.getElementById('audio');
            prevBtn = document.getElementById(
                'preview-navigation-bar-button'
            );
            prevBtnIcon = document.getElementById(
                'preview-navigation-bar-button-icon'
            );
            prevBtnMap = document.getElementById(
                'preview-navigation-bar-button-map'
            );
            prevProgress = document.getElementById('preview-progress');
            prevProgressVal = document.getElementById(
                'preview-progress-val'
            );
            voiceAnimation = document.getElementById('voice-animation');
            bindEvents();
        }

        e.listeners({
            'views.main.show.preview': show,
            'views.init.visibility.change': onVisibilityChange,
            'views.init.application.state.background':
                onApplicationStateBackground
        });

        return {
            init: init
        };
    }

});

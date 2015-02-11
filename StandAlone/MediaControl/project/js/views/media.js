/*global define, document, tizen, setTimeout, clearTimeout, setInterval,
  clearInterval, console, tau*/
/*jslint plusplus: true*/

/**
 * Media page view
 */

define({
    name: 'views/media',
    requires: [
        'core/event',
        'core/template',
        'core/application',
        'models/sapMusic',
        'models/tts'
    ],
    def: function viewsMedia(req) {
        'use strict';

        var e = req.core.event,
            app = req.core.application,
            sapMusic = req.models.sapMusic,
            tts = req.models.tts,

            volumeTimeoutId = null,
            volumeTimeout = 1500,
            // indicates if music data is visible
            showMusicData = false,
            // music change data
            message = null,

            ACTIVE_CLS = 'active',
            PEER_AGENT_DEVICE_NOT_CONNECTED = 'DEVICE_NOT_CONNECTED',
            PEER_AGENT_PEER_NOT_FOUND = 'PEER_NOT_FOUND',
            DEVICE_NOT_CONNECTED_MSG = 'Devices are not connected. ' +
                'Please pair them and relaunch Media Control.',
            PEER_AGENT_NOT_FOUND_MSG = 'Failed to find matching service on ' +
                'connected device.',
            PEER_AGENT_GENERAL_ERROR_MSG = 'Peer agent error occurs.',
            SAP_ON_TARGET_ONLY_MSG = 'SAP works only on Target. ' +
                'Please run this on Target.',

            // fast forwarding and rewinding
            FF_RB_TIMEOUT = 500,

            // fast forwarding
            fastForward = false,
            nextTimeoutHandler = 0,
            touchNext = true,

            // rewind
            rewind = false,
            prevTimeoutHandler = 0,
            touchPrev = true,

            alertElement = null,
            alertMessage = null,
            alertOk = null;

        /**
         * Adds active class for element.
         * @param {HTMLElement} ev
         */
        function onTouchStart(ev) {
            ev.target.classList.add(ACTIVE_CLS);
        }

        /**
         * Removes active class from element.
         * @param {HTMLElement} ev
         */
        function onTouchEnd(ev) {
            ev.target.classList.remove(ACTIVE_CLS);
        }

        /**
         * Plays track and changes the button class.
         * @param {HTMLElement} ev
         */
        function onPlayTouchStart(ev) {
            sapMusic.playpause();
            onTouchStart(ev);
        }

        /**
         * Changes the volume level.
         * @param {string} mode
         */
        function volumeChange(mode) {

            if (mode === 'increase') {
                sapMusic.volumeUp();
            } else {
                sapMusic.volumeDown();
            }
            sapMusic.getAttributes();
        }

        /**
         * Shows volume control buttons.
         * @param {string} level
         */
        function showVolumeLevel(level) {
            var volumeCounter = document.getElementById('volume_counter');
            volumeCounter.innerHTML = level;
            volumeCounter.style.display = 'block';

            clearInterval(volumeTimeoutId);

            volumeTimeoutId = setTimeout(function hideVolumeLevel() {
                volumeCounter.style.display = 'none';
            }, volumeTimeout);
        }

        /**
         * Gathers data from pressed button and invokes
         * interval management function.
         * @param {HTMLElement} ev
         */
        function onVolumeTouchStart(ev) {
            onTouchStart(ev);
            var vector = ev.target.getAttribute('data-vector');
            volumeChange(vector);
        }

        /**
         * Fast forward touchstart handler
         */
        function playNextStart(ev) {
            if (ev.touches[0].target.getAttribute('id') !== 'play_prev') {
                nextTimeoutHandler = setTimeout(function ffTimer() {
                    fastForward = true;
                    sapMusic.fastforwardPress();
                }, FF_RB_TIMEOUT);
                touchNext = true;
            } else {
                touchNext = false;
            }
        }

        /**
         * Fast forward touchend handler
         */
        function playNextEnd() {
            if (touchNext) {
                if (fastForward) {
                    sapMusic.fastforwardRelease();
                } else {
                    sapMusic.forward();
                    clearTimeout(nextTimeoutHandler);
                }
                fastForward = false;
                nextTimeoutHandler = 0;
            }
        }

        /**
         * Rewind back touchstart handler
         */
        function playPrevStart(ev) {
            if (ev.touches[0].target.getAttribute('id') !== 'play_next') {
                prevTimeoutHandler = setTimeout(function rewindTimer() {
                    rewind = true;
                    sapMusic.rewindPress();
                }, FF_RB_TIMEOUT);
                touchPrev = true;
            } else {
                touchPrev = false;
            }
        }

        /**
         * Rewind back touchend handler
         */
        function playPrevEnd() {
            if (touchPrev) {
                if (rewind) {
                    sapMusic.rewindRelease();
                } else {
                    sapMusic.backward();
                    clearTimeout(prevTimeoutHandler);
                }
                rewind = false;
                prevTimeoutHandler = 0;
            }
        }

        /**
         * Displays base64 image as css background.
         * @param {string} base64
         */
        function changeCover(base64) {
            var container = document.getElementById('centerContainer');
            if (base64) {
                if (container.style.backgroundImage !==
                    'url(data:image/png;base64,' + base64 + '=)') {
                    container.style['background-image'] =
                        'url(data:image/png;base64,' + base64 + '=)';
                }
            } else {
                container.style['background-image'] = 'none';
            }
        }

        /**
         * Checks if track is being played.
         * @param {string} status
         */
        function checkPlayStatus(status) {
            var playPause = document.getElementById('play_pause');

            if (!status) {
                playPause.classList.remove('paused');
                playPause.classList.remove('playing');
            } else {
                if (status === 'true') {
                    playPause.classList.remove('paused');
                    playPause.classList.add('playing');
                } else {
                    playPause.classList.remove('playing');
                    playPause.classList.add('paused');
                }
            }
        }

        /**
         * Checks if title and artist fields need to be marqueed.
         * @param {HTMLElement} titleEl
         * @param {HTMLElement} artistEl
         */
        function checkIfMarquee(titleEl, artistEl) {
            if (titleEl.innerHTML.length > 18) {
                titleEl.classList.add('marquee');
            } else {
                titleEl.classList.remove('marquee');
            }
            if (artistEl.innerHTML.length > 18) {
                artistEl.classList.add('marquee');
            } else {
                artistEl.classList.remove('marquee');
            }
        }

        /**
         * Simulates the old HTML marquee tag.
         * @param {string} album
         * @param {string} artist
         * @param {string} title
         */
        function setArtistTitle(album, artist, title) {
            var titleEl = document.getElementById('title'),
                artistEl = document.getElementById('artist');

            artist = artist === '<unknown>' ? album : artist;
            titleEl.innerHTML = title;
            artistEl.innerHTML = artist;
            tts.speak(artist + ' ' + title);
            checkIfMarquee(titleEl, artistEl);
        }

        /**
         * Updates music data
         */
        function updateMusicData() {
            var album = '',
                artist = '',
                title = '';

            if (
                showMusicData === false ||
                    message === null
            ) {
                return false;
            }

            changeCover(message.image);
            checkPlayStatus(message.playStatus);

            album = message.album || '';
            artist = message.artist || '';
            title = message.title || '';

            setArtistTitle(album, artist, title);
            return true;
        }

        /**
         * Clears music data on player.
         */
        function clearMusicData() {
            var album =  '',
                artist = '',
                title = '';

            changeCover(null);
            checkPlayStatus(null);

            setArtistTitle(album, artist, title);
        }
        /**
         * Attaches events handlers to DOM elements.
         */
        function bindEvents() {
            var volume = document.querySelectorAll('.volume_btn'),
                play = document.querySelectorAll('.play_btn'),
                track = document.querySelectorAll('.track_btn'),
                i = 0;

            i = volume.length;
            while (i--) {
                volume[i].addEventListener('touchstart', onVolumeTouchStart);
                volume[i].addEventListener('touchend', onTouchEnd);
            }
            i = play.length;
            while (i--) {
                play[i].addEventListener('touchstart', onPlayTouchStart);
                play[i].addEventListener('touchend', onTouchEnd);
            }
            i = track.length;
            while (i--) {
                track[i].addEventListener('touchstart', onTouchStart);
                track[i].addEventListener('touchend', onTouchEnd);
            }

            document.getElementById('play_prev').addEventListener(
                'touchstart',
                playPrevStart
            );
            document.getElementById('play_prev').addEventListener(
                'touchend',
                playPrevEnd
            );
            document.getElementById('play_next').addEventListener(
                'touchstart',
                playNextStart
            );
            document.getElementById('play_next').addEventListener(
                'touchend',
                playNextEnd
            );

        }

        /**
         * Detaches events handlers from DOM elements.
         */
        function unbindEvents() {
            var volume = document.querySelectorAll('.volume_btn'),
                play = document.querySelectorAll('.play_btn'),
                track = document.querySelectorAll('.track_btn'),
                i = 0;

            i = volume.length;
            while (i--) {
                volume[i].removeEventListener('touchstart', onVolumeTouchStart);
                volume[i].removeEventListener('touchend', onTouchEnd);
            }
            i = play.length;
            while (i--) {
                play[i].removeEventListener('touchstart', onPlayTouchStart);
                play[i].removeEventListener('touchend', onTouchEnd);
            }
            i = track.length;
            while (i--) {
                track[i].removeEventListener('touchstart', onTouchStart);
                track[i].removeEventListener('touchend', onTouchEnd);
            }

            document.getElementById('play_prev').removeEventListener(
                'touchstart',
                playPrevStart
            );
            document.getElementById('play_prev').removeEventListener(
                'touchend',
                playPrevEnd
            );
            document.getElementById('play_next').removeEventListener(
                'touchstart',
                playNextStart
            );
            document.getElementById('play_next').removeEventListener(
                'touchend',
                playNextEnd
            );

        }

        /**
         * Handles visibility.change event.
         */
        function onVisibilityChange() {
            var i = 0,
                activeButtons = [],
                activeButtonsLen = 0;

            if (document.visibilityState !== 'visible') {
                tts.pause();
                activeButtons = document.querySelectorAll('.' + ACTIVE_CLS);
                activeButtonsLen = activeButtons.length - 1;

                for (i = activeButtonsLen; i >= 0; i--) {
                    activeButtons[i].classList.remove(ACTIVE_CLS);
                }
            } else {
                tts.resume();
                sapMusic.mediaChangeInfo(true);
            }
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
         * Handles services connection status
         * @param {CustomEvent} data
         */
        function onConnectionLost(data) {
            if (data.detail.status === 'lost') {
                document.getElementById('main').classList.add('ui-dim');
                unbindEvents();
                clearMusicData();
            }
        }

        /**
         * Connection change event handler.
         * @param {CustomEvent} data
         */
        function onConnectionChange(data) {
            // if there was a problem with connection
            if (!data.detail.status) {
                openAlert(DEVICE_NOT_CONNECTED_MSG);
            } else {
                document.getElementById('main').classList.remove('ui-dim');
                bindEvents();
                showMusicData = true;
                updateMusicData();
            }
        }

        /**
         * Handler for music change indicator event.
         * @param {CustomEvent} data
         */
        function onMusicChange(data) {
            message = data.detail.message;
            updateMusicData();
        }

        /**
         * Handles device.supported event.
         */
        function onDeviceSupported() {
            //shows main view
            sapMusic.connect();
            document.getElementById('main-content').classList.remove('hidden');
        }

        /**
         * Handler for volume change event.
         */
        function onVolumeChange(data) {
            showVolumeLevel(data.detail.message.volume);
        }

        /**
         * Handles device.not.supported event.
         */
        function onDeviceNotSupported() {
            openAlert(SAP_ON_TARGET_ONLY_MSG);
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
         * Handles application.state.background event.
         */
        function onApplicationStateBackground() {
            if (fastForward) {
                sapMusic.fastforwardRelease();
            }
            if (rewind) {
                sapMusic.rewindRelease();
            }
        }

        /**
         * Handles application unload
         */
        function onApplicationUnload() {
            sapMusic.close();
        }

        /**
         * Handles models.sap.peeragent.error event.
         * @param {event} ev
         */
        function onPeerAgentError(ev) {
            var errorCode = ev.detail.errorCode,
                msg = '';

            switch (errorCode) {
            case PEER_AGENT_DEVICE_NOT_CONNECTED:
                msg = DEVICE_NOT_CONNECTED_MSG;
                break;
            case PEER_AGENT_PEER_NOT_FOUND:
                msg = PEER_AGENT_NOT_FOUND_MSG;
                break;
            default:
                msg = PEER_AGENT_GENERAL_ERROR_MSG;
            }

            openAlert(msg);
        }

        /**
         * Module initializer.
         */
        function init() {
            alertElement = document.getElementById('alert');
            alertMessage = document.getElementById('alert-message');
            alertOk = document.getElementById('alert-ok');
            alertElement.addEventListener('popuphide', onPopupHide);
            alertOk.addEventListener('click', onOkClick);
        }

        e.listeners({
            'core.sap.service.connect.success': onConnectionChange,
            'core.sap.service.socket.status' : onConnectionLost,
            'core.sap.peeragent.error': onPeerAgentError,
            'core.sap.music-mediachanged-ind': onMusicChange,
            'core.sap.music-getattribute-rsp': onVolumeChange,
            'views.initPage.device.supported': onDeviceSupported,
            'views.initPage.device.not.supported': onDeviceNotSupported,
            'views.initPage.visibility.change': onVisibilityChange,
            'views.initPage.application.unload': onApplicationUnload,
            'views.initPage.application.state.background':
                onApplicationStateBackground
        });

        return {
            init: init
        };

    }
});

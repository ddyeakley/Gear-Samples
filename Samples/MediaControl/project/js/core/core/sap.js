/*global define, console*/
/*jslint regexp: true*/

/**
 * SAP module.
 * @requires {@link core/window}
 * @requires {@link core/event}
 * @namespace core/sap
 * @memberof core
 */

define({
    name: 'core/sap',
    requires: [
        'core/window',
        'core/event'
    ],
    def: function coreSap(window, e) {
        'use strict';

        var webapis = window.webapis,
            socket = null;

        /**
         * Checks if SAP socket is connected.
         * @memberof core/sap
         * @return {boolean}
         */
        function isConnected() {
            if (socket !== null) {
                return socket.isConnected();
            }
            return false;
        }

        /**
         * Sends data to SAP socket.
         * @memberof core/sap
         *
         * @param {number} channel Channel number.
         * @param {object} data Data to be sent.
         */
        function sendData(channel, data) {
            if (!isConnected()) {
                console.error('There is no connection, please connect first.');
                return false;
            }

            socket.sendData(channel, JSON.stringify(data));
        }

        /**
         * Handles data receive.
         * @param {number} channel Channel number.
         * @param {object} dataMessage
         */
        function onSocketDataReceive(channel, data) {
            var message = JSON.parse(data);

            e.fire(message.msgId, {channel: channel, message: message});
        }

        /**
         * Handles connection lost.
         * @param {string} err
         */
        function onSocketStatusChanged(err) {
            socket = null;
            e.fire('service.socket.status', {status: 'lost', data: err});
        }

        /**
         * Handles service connection response.
         * @param {SASocket} saSocket The SASocket object that represents the
         * Service Connection with a remote Accessory Peer Agent.
         */
        function onServiceConnect(saSocket) {
            saSocket.setDataReceiveListener(onSocketDataReceive);
            saSocket.setSocketStatusListener(onSocketStatusChanged);
            socket = saSocket;
            e.fire('service.connect.success', {status: true});
        }

        /**
         * Handles service connection error.
         * @param {string} err
         */
        function onServiceConnectionError(err) {
            console.warn('Service connection error: ' + err);
            e.fire('service.connect.error', {status: false, data: err});
        }

        /**
         * Handles SAP agent request.
         * @param {SAAgent[]} agents Available SAAgents defined in
         * the Service Profile.
         */
        function onSAAgentRequestSuccess(agents) {
            var agent = agents[0];

            agent.setServiceConnectionListener({
                onconnect: onServiceConnect,
                onerror: onServiceConnectionError
            });

            agent.setPeerAgentFindListener({
                /**
                 * @param {SAPeerAgent} peerAgent
                 * Found remote Accessory Peer Agent.
                 * @memberof core/sap
                 * @private
                 * @inner
                 */
                onpeeragentfound: function onpeeragentfound(peerAgent) {
                    agent.requestServiceConnection(peerAgent);
                },
                onerror: function onerror(code) {
                    console.error('Failed to find peerAgents.');
                    e.fire('peeragent.error', {errorCode: code});
                }
            });

            agent.findPeerAgents();

            e.fire('connect.success', {status: true});
        }

        /**
         * Handles SAP agent request error.
         * @param {object} err
         */
        function onSAAgentRequestError(err) {
            e.fire('connect.error', {status: false, data: err});
        }

        /**
         * Handles device status changes (attached, detached).
         * @param {string} type
         * @param {string} status
         */
        function onDeviceStatusChanged(type, status) {
            if (status === 'ATTACHED') {
                e.fire('device.attached', {type: type});
            } else if (status === 'DETACHED') {
                e.fire('device.detached', {type: type});
            }
        }

        /**
         * Sets device status listener and requests for agents.
         * @memberof core/sap
         */
        function connect() {
            if (isConnected()) {
                console.log('Already connected.');
                return false;
            }

            try {
                webapis.sa.setDeviceStatusListener(onDeviceStatusChanged);
            } catch (e) {
                console.warn('Error error message : ' + e.message);
            }

            try {
                webapis.sa.requestSAAgent(
                    onSAAgentRequestSuccess,
                    onSAAgentRequestError
                );
            } catch (e) {
                console.warn('Request for SAAgent failed: ' + e.message);
            }
        }

        /**
         * Closes socket.
         * @memberof core/sap
         */
        function close() {
            if (isConnected()) {
                socket.close();
            }
        }

        return {
            connect: connect,
            close: close,
            sendData: sendData,
            isConnected: isConnected
        };
    }

});


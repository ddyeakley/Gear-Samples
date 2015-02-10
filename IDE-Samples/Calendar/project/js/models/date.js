/*global define*/
/*jslint regexp: true*/

/**
 * Date module
 */

define({
    name: 'models/date',
    requires: [
        'core/event',
        'helpers/date'
    ],
    def: function modelsDate(e, d) {
        'use strict';

        var currentDate = new Date();

        /**
         * get current date
         * @return {TZDate}
         */
        function getCurrentDate() {
            return d.clone(currentDate);
        }

        /**
         * set current date
         * @param {object} date
         */
        function setCurrentDate(date) {
            currentDate = date;
        }

        function init() {
        }

        return {
            init: init,
            getCurrentDate: getCurrentDate,
            setCurrentDate: setCurrentDate
        };
    }

});

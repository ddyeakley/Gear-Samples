/*global define*/

/**
 * Date helpers module
 */

define({
    name: 'helpers/date',
    def: function helpersDate() {
        'use strict';

        var SECOND_IN_MS = 1000,
            MINUTE_IN_MS = 60000,
            HOUR_IN_MS = 3600000,
            DAY_IN_MS = 86400000,

            monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];

        /**
         * Returns current datetime
         * @return {Date}
         */
        function getCurrentDateTime() {
            return new Date();
        }

        /**
         * Clones date.
         * @param Date} date
         * @return {Date}
         */
        function clone(date) {
            return new Date(date);
        }

        /**
         * Return numbers of days in month
         * @param {Date} date
         * @return {number}
         */
        function daysInMonth(date) {
            var newDate = clone(date);

            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + 1);

            return (
                new Date(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    0
                )
            ).getDate();
        }

        /**
         * Check if new date has in range day of old date
         * @param {Date} oldDate
         * @param {Date} newDate
         * @return {number}
         */
        function getCorrectDay(oldDate, newDate) {
            var day = 1;

            if (daysInMonth(newDate) < oldDate.getDate()) {
                day = daysInMonth(newDate);
            } else {
                day = oldDate.getDate();
            }

            return day;
        }

        /**
         * Return next month
         * @param {Date} date
         * @return {Date}
         */
        function getNextMonth(date) {
            var newDate = clone(date);

            newDate.setDate(1);
            newDate.setMonth(date.getMonth() + 1);
            newDate.setDate(getCorrectDay(date, newDate));

            return newDate;
        }

        /**
         * Return previous month
         * @param {Date} date
         * @return {Date}
         */
        function getPreviousMonth(date) {
            var newDate = clone(date);

            newDate.setDate(1);
            newDate.setMonth(date.getMonth() - 1);
            newDate.setDate(getCorrectDay(date, newDate));

            return newDate;
        }

        /**
         * Return name of month
         * @param {object/number} date
         * @return {string}
         */
        function getMonthName(date) {
            var monthName = '';
            if (date instanceof Date) {
                monthName = monthNames[date.getMonth()];
            } else {
                monthName = monthNames[date];
            }
            return monthName;
        }

        /**
         * Position of first day of month
         * @param {Date} date
         * @return {number}
         */
        function getFirstDay(date) {
            var newDate = clone(date);

            newDate.setDate(1);
            return newDate.getDay();
        }

        /**
         * Prepare date to data format
         * @param {Date} data
         * @return {string}
         */
        function toDataString(data) {
            return data.getFullYear() + ',' +
                data.getMonth() + ',' + data.getDate();
        }

        return {
            clone: clone,
            daysInMonth: daysInMonth,
            getFirstDay: getFirstDay,
            getPreviousMonth: getPreviousMonth,
            getNextMonth: getNextMonth,
            getMonthName: getMonthName,
            getCurrentDateTime: getCurrentDateTime,
            toDataString: toDataString
        };
    }
});

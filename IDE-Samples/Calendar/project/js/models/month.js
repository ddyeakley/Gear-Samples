/*global define, console*/
/*jslint plusplus: true*/

/**
 * Month module
 */

define({
    name: 'models/month',
    requires: [
        'helpers/date'
    ],
    def: function modelsMonth(d) {
        'use strict';

        var DAYS_IN_WEEK = 7;

        /**
         * Prepare data array with date
         * @param {objectr} date
         * @param {number} day
         * @param {number} month Month shift.
         * @return {Array}
         */
        function getDayData(date, day, shift) {
            var newDate = d.clone(date);

            if (shift) {
                newDate.setMonth(date.getMonth() + shift);
            }
            newDate.setDate(day);

            return {
                'day': day,
                'dateString': d.toDataString(newDate),
                'inactive': shift ? 'inactive' : ''
            };
        }

        /**
         * Creates matrix of days in months
         * Example: [ [29,30,1,2,3,4,5], [6,7,8,9,10,11,12], ...]
         * @param {Date} date Date object.
         * @return {array} daysMatrix Days matrix.
         */
        function getDaysMatrix(date) {
            var daysNumber = d.daysInMonth(date),
                daysPad = d.getFirstDay(date),
                previous = d.getPreviousMonth(date),
                previousDaysNumber = d.daysInMonth(previous),
                rowsLength = Math.ceil((daysNumber + daysPad) / DAYS_IN_WEEK),
                data = [],
                daysMatrix = [],
                start = 0,
                next = 1,
                i = 1,
                j = 0;

            // previous month days fill
            while (daysPad--) {
                data.push(getDayData(date, previousDaysNumber - daysPad, -1));
            }

            // current month days
            for (i; i <= daysNumber; i = i + 1) {
                data.push(getDayData(date, i, 0));
            }

            // next month days fill
            while (data.length % DAYS_IN_WEEK) {
                data.push(getDayData(date, next++, 1));
            }

            for (j = 0; j < rowsLength; j = j + 1) {
                start = j * DAYS_IN_WEEK;
                daysMatrix.push(data.slice(start, start + DAYS_IN_WEEK));
            }

            return daysMatrix;
        }

        return {
            getDaysMatrix: getDaysMatrix
        };
    }

});

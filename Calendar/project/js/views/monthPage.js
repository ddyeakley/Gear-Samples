/*global define, console, document*/
/*jslint plusplus: true*/

/**
 * Month page module
 */

define({
    name: 'views/monthPage',
    requires: [
        'core/template',
        'models/date',
        'models/month',
        'helpers/date'

    ],
    def: function viewsMonthPage(req) {
        'use strict';

        var t = req.core.template,
            d = req.helpers.date,
            month = req.models.month,
            dateModel = req.models.date,
            page = null,
            pageContent = null,
            monthHeader = null,
            monthFooter = null,
            prevBtn = null,
            currentBtn = null,
            nextBtn = null,
            DAY_TODAY_CLS = 'today',
            ROWS_NUMBER = 6;

        /**
         * Push data to template and add it to page.
         * @param {array} data
         * @param {string} id
         */
        function addRow(data, id) {
            var row = t.get('monthRow', {
                days: data
            });

            document.getElementById(id + '-table').innerHTML += row;
        }

        /**
         * Adds empty row to month page.
         * @param {string} id
         */
        function addEmptyRow(id) {
            var row = t.get('emptyMonthRow');

            document.getElementById(id + '-table').innerHTML += row;
        }

        /**
         * Fill month grid.
         * @param {Date} date
         * @param {string} id
         */
        function fillTable(date, id) {
            var daysMatrix = month.getDaysMatrix(date),
                weeks = daysMatrix.length,
                i = 0,
                emptyRows = ROWS_NUMBER - weeks;

            for (i = 0; i < weeks; i += 1) {
                addRow(daysMatrix[i], id);
            }

            for (i = 0; i < emptyRows; i += 1) {
                addEmptyRow(id);
            }
        }

        /**
         * Set page title with month and year.
         */
        function setHeader() {
            var date = dateModel.getCurrentDate();

            monthHeader.innerHTML = d.getMonthName(date) + ' ' +
                date.getFullYear();
        }


        /**
         * Add month table template to body.
         */
        function prepareTables() {
            pageContent.innerHTML = t.get('monthTable', {id: 'month'});
        }

        /**
         * Add class to day element.
         * @param {Date|string} date
         * @param {string} className
         */
        function markDay(date, className) {
            var dateString = typeof date === 'string' ?
                        date : d.toDataString(date),
                today = document.querySelector(
                    '[data-date="' + dateString + '"]'
                );

            if (today) {
                today.classList.add(className);
            }
        }

        /**
         * Fill tables with calendar data.
         */
        function fillTables() {
            var date = dateModel.getCurrentDate();
            fillTable(date, 'month');
        }

        /**
         * Create calendar tables and events for month view.
         */
        function createView() {
            setHeader();
            prepareTables();
            fillTables();
            markDay(d.getCurrentDateTime(), DAY_TODAY_CLS);
        }

        /**
         * Handles click event on prevBtn button.
         */
        function onPrevMonthBtnTap() {
            var currentDate = dateModel.getCurrentDate(),
                prevMonthDate = d.getPreviousMonth(currentDate);

            dateModel.setCurrentDate(prevMonthDate);
            createView();
        }

        /**
         * Handles click event on nextBtn button.
         */
        function onNextMonthBtnTap() {
            var currentDate = dateModel.getCurrentDate(),
                nextMonthDate = d.getNextMonth(currentDate);

            dateModel.setCurrentDate(nextMonthDate);
            createView();
        }

        /**
         * Handles click event on currentBtn button.
         */
        function onCurrentMonthBtnTap() {
            dateModel.setCurrentDate(d.getCurrentDateTime());
            createView();
        }

        /**
         * Shows main screen - month page
         */
        function showMonthPage() {
            var pageHeight = page.offsetHeight,
                headerHeight = monthHeader.offsetHeight,
                footerHeight = monthFooter.offsetHeight,
                contentHeight = pageHeight - headerHeight - footerHeight;

            pageContent.style.height = contentHeight + 'px';
            page.classList.remove('invisible');
        }

        /**
         * Registers view event listeners.
         */
        function bindEvents() {
            prevBtn.addEventListener('click', onPrevMonthBtnTap);
            currentBtn.addEventListener('click', onCurrentMonthBtnTap);
            nextBtn.addEventListener('click', onNextMonthBtnTap);
        }

        /**
         * Inits module.
         */
        function init() {
            page = document.getElementById('month-page');
            pageContent = document.getElementById('month-page-table-content');
            monthHeader = document.getElementById('month-header');
            monthFooter = document.getElementById('month-footer');
            prevBtn = document.getElementById('prev-month-btn');
            currentBtn = document.getElementById('current-month-btn');
            nextBtn = document.getElementById('next-month-btn');
            bindEvents();
            createView();
            showMonthPage();
        }

        return {
            init: init
        };
    }

});

/*global define, tizen*/
/*jslint plusplus: true */

/**
 * Dom helper module
 */

define({
    name: 'helpers/dom',
    requires: [
    ],
    def: function helpersDom() {
        'use strict';

        /**
         * Returns parent node with class name given as second parameter
         * of the child given as first parameter.
         * @param {DOMElement} element
         * @param {string} parentClassName
         * @return {DOMElement}
         */
        function findParentByClassName(element, parentClassName) {
            parentClassName = parentClassName.toLowerCase();
            do {
                element = element.parentNode;
                if (element.classList &&
                        element.classList.contains(parentClassName)) {
                    return element;
                }
            } while (element.parentNode);
        }

        return {
            findParentByClassName: findParentByClassName
        };
    }
});

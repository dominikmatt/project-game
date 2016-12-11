'use strict';

/**
 * Base Service a Service must extend from this Class.
 */
module.exports = class BaseService {
    constructor(name) {
        /**
         * @type {String}
         */
        this._name = name;
    }

    /**
     * Returns the name of current service.
     *
     * @returns {String}
     */
    get name() {
        return this._name;
    }
};
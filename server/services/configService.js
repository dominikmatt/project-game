'use strict';

const _ = require('lodash');

let ENV = 'dev';

if(process.env.NODE_ENV) {
    ENV = process.env.NODE_ENV;
}

/**
 * @type {Symbol}
 */
const singleton = Symbol();

/**
 * @type {Symbol}
 */
const singletonEnforcer = Symbol();

/**
 * All Configurations are stored in this service.
 */
class ConfigService {
    constructor() {
        /**
         * @private
         */
        this._config = {};
        this.loadConfig();
    }

    /**
     * @returns {Core}
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ConfigService(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * Extend global config and env config.
     */
    loadConfig() {
        this._config = _.extend(
            require('./../config/env/all'),
            require('./../config/env/' + ENV) || {}
        );
    }

    /**
     * @returns {Object}
     */
    get config() {
        return this._config;
    }

    /**
     * @param {Object} value
     */
    set config(value) {
        this._config = value;
    }
};

module.exports = ConfigService.instance;
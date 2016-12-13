'use strict';

const BaseService = require('./BaseService.js');
const _ = require('lodash');

/**
 * All Configurations are stored in this service.
 */
class ConfigService extends BaseService {
    constructor(env) {
        super('config');
        /**
         * @private
         */
        this.env = env;
        this._config = {};
        this.loadConfig();
    }

    /**
     * Extend global config and env config.
     */
    loadConfig() {
        this._config = _.extend(
            require('./../config/env/all'),
            require('./../config/env/' + this.env) || {}
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

module.exports = ConfigService;
'use strict';

const BaseService = require('./BaseService.js');
const _ = require('lodash');

let ENV = 'dev';

if(process.env.NODE_ENV) {
    ENV = process.env.NODE_ENV;
}

/**
 * All Configurations are stored in this service.
 */
class ConfigService extends BaseService {
    constructor() {
        super('config');
        /**
         * @private
         */
        this._config = {};
        this.loadConfig();
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

module.exports = ConfigService;
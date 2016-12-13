'use strict';

const color = require('cli-color');
const envs = require('./../constants.js').envs;

/**
 * Logger for Server. Disabled on
 * @type {Logger}
 */
module.exports = class Logger {
    constructor(env) {
        this.env = env;
    }

    /**
     * Info --> Yellow.
     *
     * @param {string} message
     */
    info(message) {
        this._log(color.yellow(message), false);
    }

    /**
     * Error --> Red.
     * @param {string} message
     */
    error(message) {
        this._log(color.red(message), true);
    }

    /**
     * Notice --> blue.
     *
     * @param {string} message
     */
    notice(message) {
        this._log(color.blue(message), false);
    }

    /**
     * Loggs a message to console or log-file.
     *
     * @param {string} message
     * @param {boolean} force If true this will logged on prod-env.
     *
     * @private
     */
    _log(message, force) {
        if (envs.dev === this.env || force) {
            console.log(message);
        }
    }
};
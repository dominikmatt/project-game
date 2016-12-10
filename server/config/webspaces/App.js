'use strict';

const express = require('express');
const configService = require('./../../Services/configService.js');

/**
 * Webspace for App.
 * Handle all Templates.
 *
 * @type {AppWebspace}
 */
module.exports = class AppWebspace {
    constructor() {
        this.app = null;
        this.startServer();
    }

    startServer() {
        this.app = express();

        this.setServerConfig();
        this.app.listen(configService.config.port);
    }

    setServerConfig() {
        this.app.set('view engine', 'ejs');
    }
};
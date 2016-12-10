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

    /**
     * Start Webserver.
     */
    startServer() {
        this.app = express();

        this.setup();
        this.app.listen(configService.config.appPort);
    }

    /**
     * Setup Websserver.
     */
    setup() {
        this.app.set('view engine', 'ejs');
    }
};
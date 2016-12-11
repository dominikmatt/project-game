'use strict';

const express = require('express');

/**
 * Webspace for App.
 * Handle all Templates.
 *
 * @type {AppWebspace}
 */
module.exports = class AppWebspace {
    constructor() {
        const core = require('./../core.js');
        this.configService = core.getService('config');
        this.app = null;
        this.startServer();
    }

    /**
     * Start Webserver.
     */
    startServer() {
        this.app = express();

        this.setup();
        this.app.listen(this.configService.config.appPort);
    }

    /**
     * Setup Websserver.
     */
    setup() {
        this.app.set('view engine', 'ejs');
    }
};
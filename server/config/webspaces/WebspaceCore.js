'use strict';
const path = require('path');
const glob = require("glob");
const routesPath = path.join(__dirname, '../../routes/*.rest.js');

/**
 * @type {AppWebspace}
 */
const WebSocketWebspace = require('./Websocket.js');

/**
 * @type {AppWebspace}
 */
const AppWebspace = require('./App.js');

module.exports = class WebspaceCore {
    constructor() {
        this._core = require('./../core.js');
        this._core.logger.info('init Webspaces…');
        this.startWebspaces();
    }

    /**
     * Start all Webspaces.
     */
    startWebspaces() {
        this.wsApp = new WebSocketWebspace();
        this.app = new AppWebspace();

        this.loadRestRoutes();
    }

    /**
     * Load all route files from /routes Folder.
     */
    loadRestRoutes() {
        const loadRouteFile = (error, files) => {
            files.forEach((file) => {
                require(file).initialize(this.app, this.wsApp);
            });
        };

        glob(routesPath, loadRouteFile);
    }
};
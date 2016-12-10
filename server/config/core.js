'use strict';

const path = require('path');
const fs = require('fs');
const routesPath = path.join(__dirname, '../routes')

/**
 * @type {AppWebspace}
 */
const WebSocketWebspace = require('./webspaces/Websocket.js');

/**
 * @type {AppWebspace}
 */
const AppWebspace = require('./webspaces/App.js');

/**
 * @type {Symbol}
 */
const singleton = Symbol();

/**
 * @type {Symbol}
 */
const singletonEnforcer = Symbol();

/**
 * Core class of server structure.
 *
 * @type {Core}
 */
class Core {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton Core";

        this._wsApp = null;
        this._app = null;
        this.startWebspaces();
    }

    /**
     * @returns {Core}
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Core(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * Start all Webspaces.
     */
    startWebspaces() {
        this._wsApp = new WebSocketWebspace();
        this._app = new AppWebspace();

        this.loadRoutes();
    }

    loadRoutes() {
        const loadRouteFile = (file) => {
            require(`${routesPath}/${file}`).initialize(this.app, this.wsApp);
        };

        fs
            .readdirSync(routesPath)
            .forEach(loadRouteFile);
    }

    get wsApp() {
        return this._wsApp;
    }

    set wsApp(value) {
        this._wsApp = value;
    }

    get app() {
        return this._app;
    }

    set app(value) {
        this._app = value;
    }
};

module.exports = Core.instance;
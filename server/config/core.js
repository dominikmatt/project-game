'use strict';

const Logger = require('./../lib/Logger.js');
const path = require('path');
const glob = require("glob");
const serviesPath = path.join(__dirname, '../services/*.service.js');

let ENV = 'dev';

if(process.env.NODE_ENV) {
    ENV = process.env.NODE_ENV;
}

/**
 * @type {AppWebspace}
 */
const WebSocketCore = require('./webspaces/WebspaceCore.js');

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
        if (enforcer !== singletonEnforcer) throw "Cannot construct singleton Core";

        this._wsApp = null;
        this._app = null;
        this._services = {};
        this._logger = new Logger(ENV);
    }

    run() {
        this.loadServices()
            .then(() => {
                this.webspaceCore = new WebSocketCore();
            });
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
     * Load service files from /services Folder.
     */
    loadServices() {
        this.logger.info('load services…');

        const loadServiceFiles = (resolve, error, files) => {
            files.forEach((file, index) => {
                const ServiceClass = require(file);
                let serviceInstance = new ServiceClass(ENV);

                this._services[serviceInstance.name] = serviceInstance;

                if (index === files.length - 1) {
                    resolve();
                }
            });
        };

        return new Promise((resolve) => {
            glob(serviesPath, loadServiceFiles. bind(this, resolve));
        });
    }

    /**
     * Returns Service by given Name.
     *
     * @param {string} name
     * @returns {*}
     */
    getService(name) {
        if (this._services[name]) {
            return this._services[name];
        }

        return false;
    }

    /**
     * @returns {WebsocketWebspace}
     */
    get wsApp() {
        return this._wsApp;
    }

    /**
     * @param {WebsocketWebspace} value
     */
    set wsApp(value) {
        this._wsApp = value;
    }

    /**
     * @returns {AppWebspace}
     */
    get app() {
        return this._app;
    }

    /**
     * @param {AppWebspace} value
     */
    set app(value) {
        this._app = value;
    }

    /**
     * @returns {Logger}
     */
    get logger() {
        return this._logger;
    }
};

module.exports = Core.instance;
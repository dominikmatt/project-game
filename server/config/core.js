'use strict';

const path = require('path');
const glob = require("glob");
const serviesPath = path.join(__dirname, '../services/*.service.js');

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
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton Core";

        this._wsApp = null;
        this._app = null;
        this._services = {};
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
        console.log('load services');
        const loadServiceFiles = (resolve, error, files) => {
            files.forEach((file, index) => {
                const ServiceClass = require(file);
                let serviceInstance = new ServiceClass();

                console.log('init service:', serviceInstance.name);
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
        console.log(name);
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
};

module.exports = Core.instance;
'use strict';

const BaseService = require('./BaseService.js');
const SocketStore = require('./SocketStore.js');
const path = require('path');
const glob = require("glob");
const routesPath = path.join(__dirname, '../routes/*.socket.js');

/**
 * Handles Socket connections.
 */
class SocketService extends BaseService {
    constructor() {
        super('socket');

        this._core = require('./../config/core.js');

        /**
         * @type {Server}
         * @private
         */
        this._io = null;

        /**
         * @type {SocketStore}
         * @private
         */
        this._store = new SocketStore();
    }

    /**
     * Bin Socket-Events.
     */
    listenForConnection() {
        this.io.on('connection', this.onNewConnection.bind(this));
    }

    /**
     * Called on a new Socket-Connection.
     *
     * @param {Server} socket
     */
    onNewConnection(socket) {
        this._core.logger.notice(`new connection by ${socket.id}`);
        this.store.add(socket.id, socket);

        // Bin disconnect event
        socket.on('disconnect', () => {
            this.store.remove(socket.id);
        });

        this.loadSocketRoutes(socket);
    }

    /**
     * Load all route files from /routes Folder.
     *
     * @param {Server} socket
     */
    loadSocketRoutes(socket) {
        const loadRouteFile = (error, files) => {
            files.forEach((file) => {
                require(file).initialize(socket);
            });
        };

        glob(routesPath, loadRouteFile);
    }

    /**
     * @returns {Server}
     */
    get io() {
        return this._io;
    }

    /**
     * @param {Server} value
     */
    set io(value) {
        this._io = value;
    }

    /**
     * @returns {SocketStore}
     */
    get store() {
        return this._store;
    }
};

module.exports = SocketService;
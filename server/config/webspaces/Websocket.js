'use strict';

const express = require('express');
const socketIo = require('socket.io');
const app = express();
const server = require('http').createServer(app);

/**
 * Webspace for Websocket.
 * Handle all Websocket connections.
 *
 * @type {AppWebspace}
 */
module.exports = class WebSocketWebspace {
    constructor() {
        const core = require('./../core.js');
        this.configService = core.getService('config');
        this.socketService = core.getService('socket');

        /**
         * @private
         */
        this._io = null;
        this.setup();
        this.startServer()
    }

    /**
     * Setup server.
     */
    setup() {
        app.use(function(req, res, next) {
            // TODO: Set a correct origin.
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Origin', 'http://localhost:9004');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        });
    }

    /**
     * Start Websocket Server
     */
    startServer() {
        this.io = socketIo();
        this.io.listen(server);
        server.listen(this.configService.config.wsPort);
        this.socketService.io = this.io;
        this.socketService.listenForConnection();
        this.io.on('my other event', function(data) {
            console.log(data);
        });
    }

    /**
     * @returns {SocketIo}
     */
    get io() {
        return this._io;
    }

    /**
     * @param {SocketIo} value
     */
    set io(value) {
        this._io = value;
    }
};
'use strict';

const express = require('express');
const socketIo = require('socket.io');
const configService = require('./../../Services/configService.js');
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
        server.listen(configService.config.wsPort);

        this.io.on('connection', function(socket) {
            console.log('connection');
            socket.emit('news', {hello: 'world'});
            socket.on('my other event', function(data) {
                console.log(data);
            });
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
'use strict';

import io from 'socket.io-client';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();

/**
 * @class ConnectionService
 */
class ConnectionService {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw 'Cannot construct singleton ConnectionService';

        console.log('init connection');
        var socket = io('http://localhost:9005');
        socket.on('event.send', function (data) {
            console.log(data);
            socket.emit('event.get', { my: 'data' });
        });
    }

    /**
     * @returns {WorkerManagerService}
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ConnectionService(singletonEnforcer);
        }

        return this[singleton];
    }
}

export default ConnectionService.instance;
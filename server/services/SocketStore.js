'use strict';

let store = [];

/**
 * Socket Store.
 *
 * @type {SocketStore}
 */
module.exports = class SocketStore {
    constructor() {

    }

    /**
     * Add a socket to store.
     *
     * @param {String} id
     * @param {Server} socket
     */
    add(id, socket) {
        store[id] = socket;
    }

    /**
     * Remove socket from store.
     *
     * @param {String} id
     */
    remove(id) {
        delete store[id];
    }
};
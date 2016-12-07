'use strict';

import uniqueId from 'lodash/uniqueId';

const ONE_TYPE = 'one';
const ON_TYPE = 'on';

/**
 * Register a new Worker.
 */
export default class WorkerClass {
    constructor(key, options) {
        /**
         * @type {String}
         */
        this.key = key;

        /**
         * @type {String}
         */
        this.fileName = options.fileName || `{this.key}.js`;

        /**
         * @type {String}
         */
        this.url = '/dist/worker/' + this.fileName;

        /**
         * @type {Array}
         */
        this.handler = [];

        /**
         * @type {Worker}
         */
        this.worker = new Worker(this.url);

        this.messageHandler();
    }

    /**
     * Listen for message and call registerd callbacks.
     */
    messageHandler() {
        this.worker.addEventListener('message', (event) => {
            let eventKey = event.data.eventKey;

            this.handler[eventKey].forEach((data, key) => {
                // Remove event handler if bin it only once.
                if (ONE_TYPE === data.type) {
                    delete this.handler[eventKey][key];
                }

                data.cb.call(null, event.data.data);
            });
        });
    }

    /**
     * Will remove listener after first call.
     *
     * @param {String} eventName
     * @param {Function} cb
     */
    one(eventName, cb) {
        this.listen(eventName, cb, ONE_TYPE);
    }

    /**
     * Register a allway open event listener.
     *
     * @param {String} eventName
     * @param {Function} cb
     */
    on(eventName, cb) {
        this.listen(eventName, cb, ON_TYPE);
    }

    /**
     * Register event listener.
     * @param eventName
     * @param cb
     * @param type
     */
    listen(eventName, cb, type) {
        if (!this.handler[eventName]) {
            this.handler[eventName] = [];
        }

        this.handler[eventName].push({
            cb: cb,
            type: type
        });
    }

    /**
     *
     * @param args
     * @returns {Promise}
     */
    post(...args) {
        return new Promise((resolve) => {
            let eventKey = uniqueId(this.key);
            this.worker.postMessage([eventKey, ...args]);

            this.one(eventKey, resolve);
        })
    }
}
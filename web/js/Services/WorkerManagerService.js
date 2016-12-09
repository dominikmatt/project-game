'use strict';

import WorkerClass from './../Modules/WorkerClass.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();

/**
 * @class WorkerManagerService
 */
class WorkerManagerService {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw 'Cannot construct singleton WorkerManagerService';

        this.worker = {};
    }

    /**
     * @returns {WorkerManagerService}
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new WorkerManagerService(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * Returns worker instance.
     *
     * @param {String} key
     *
     * @returns {WorkerClass}
     */
    getWorker(key) {
        if (!this.worker[key]) {

            this.worker[key] = new WorkerClass(key, {
                fileName: `${key}.js`
            });
        }

        return this.worker[key];
    }
}

export default WorkerManagerService.instance;
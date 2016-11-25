'use strict';

var THREE = require('three');
import scene from './Scene.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();


/**
 * @class Camera
 * @deprecated
 *
 * TODO: move camera to player
 */
class Camera {
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Camera";

        /**
         * @type {THREE.PerspectiveCamera}
         * @private
         */
        this._camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.set(0, 30, 50);
    }

    /**
     * @returns {Camera}
     */
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Camera(singletonEnforcer);
        }

        return this[singleton];
    }

    update() {

    }

    /**
     * @returns {THREE.PerspectiveCamera}
     */
    get camera() {
        return this._camera;
    }
}

export default Camera.instance;
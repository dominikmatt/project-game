'use strict';

import THREE from 'three';
import scene from './Scene.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol()


/**
 * @class Camera
 */
class Camera {
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Camera";

        /**
         * @type {THREE.PerspectiveCamera}
         * @private
         */
        this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(scene.scene.position);
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

    /**
     * @returns {THREE.PerspectiveCamera}
     */
    get camera() {
        return this._camera;
    }
}

export default Camera.instance;
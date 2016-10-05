'use strict';

import THREE from 'three';
var Physijs = require('physijs-browserify')(THREE);

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol()

class Scene {
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Scene";

        /**
         * @type {Physijs.Scene}
         * @private
         */
        this._scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });

        this.scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
    }

    /**
     * @returns {Scene}
     */
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Scene(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * @returns {THREE.Scene}
     */
    get scene() {
        return this._scene;
    }
}

export default Scene.instance;